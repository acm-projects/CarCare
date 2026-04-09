import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class VinChatBotServer {
    private static final String SYSTEM_PROMPT =
            "You are a helpful vehicle assistant. Use VIN specifications provided to answer questions accurately.";

    private static final Map<String, List<Map<String, String>>> conversationsBySession =
            new ConcurrentHashMap<>();

    /** Prefer shell env; otherwise read `OPENAI_API_KEY` from `./.env` (run server from `backend/`). */
    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) return a.trim();
        if (b != null && !b.isBlank()) return b.trim();
        return null;
    }

    private static String loadOpenAiKeyFromDotEnv() {
        Path envPath = Paths.get(".env");
        if (!Files.isRegularFile(envPath)) {
            return null;
        }
        try {
            for (String line : Files.readAllLines(envPath, StandardCharsets.UTF_8)) {
                String t = line.trim();
                if (t.isEmpty() || t.startsWith("#")) {
                    continue;
                }
                int eq = t.indexOf('=');
                if (eq <= 0) {
                    continue;
                }
                String key = t.substring(0, eq).trim();
                if (!"OPENAI_API_KEY".equals(key)) {
                    continue;
                }
                String val = stripQuotes(t.substring(eq + 1).trim());
                if (!val.isEmpty()) {
                    return val;
                }
            }
        } catch (IOException e) {
            System.err.println("Warning: could not read .env: " + e.getMessage());
        }
        return null;
    }

    private static String stripQuotes(String s) {
        if (s.length() >= 2) {
            char a = s.charAt(0);
            char z = s.charAt(s.length() - 1);
            if ((a == '"' && z == '"') || (a == '\'' && z == '\'')) {
                return s.substring(1, s.length() - 1);
            }
        }
        return s;
    }

    public static void main(String[] args) throws Exception {
        String fromEnv = System.getenv("OPENAI_API_KEY");
        String fromFile = loadOpenAiKeyFromDotEnv();
        String apiKey = firstNonBlank(fromEnv, fromFile);
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("Error: No OpenAI API key found.");
            System.out.println("Either: export OPENAI_API_KEY=sk-...");
            System.out.println("Or create backend/.env with a line: OPENAI_API_KEY=sk-...");
            System.out.println("(See .env.example in this folder.)");
            return;
        }
        if (fromFile != null && !fromFile.isBlank() && (fromEnv == null || fromEnv.isBlank())) {
            System.out.println("Loaded OPENAI_API_KEY from .env in current directory.");
        }

        int port = 8080;
        String portEnv = System.getenv("PORT");
        if (portEnv != null && !portEnv.isBlank()) {
            try {
                port = Integer.parseInt(portEnv.trim());
            } catch (NumberFormatException ignored) {
                // keep default
            }
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/health", new HealthHandler());
        server.createContext("/chat", new ChatHandler(apiKey));
        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();

        System.out.println("VIN Chatbot server running on http://localhost:" + port);
        System.out.println("Endpoints: GET /health, POST /chat");
    }

    private static final class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCors(exchange);
            if (isPreflight(exchange)) return;

            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            writeJson(exchange, 200, "{\"ok\":true}");
        }
    }

    private static final class ChatHandler implements HttpHandler {
        private final String apiKey;

        private ChatHandler(String apiKey) {
            this.apiKey = apiKey;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCors(exchange);
            if (isPreflight(exchange)) return;

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                writeJson(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = readUtf8(exchange.getRequestBody());
            String message = extractJsonString(body, "message");
            String sessionId = extractJsonString(body, "sessionId");

            if (message == null || message.isBlank()) {
                writeJson(exchange, 400, "{\"error\":\"Missing 'message'\"}");
                return;
            }

            if (sessionId == null || sessionId.isBlank()) {
                sessionId = UUID.randomUUID().toString();
            }

            List<Map<String, String>> conversation = conversationsBySession.computeIfAbsent(sessionId, (k) -> {
                List<Map<String, String>> seeded = new ArrayList<>();
                seeded.add(mapOf("role", "system", "content", SYSTEM_PROMPT));
                return seeded;
            });

            try {
                String userInput = message.trim();

                if (isVin(userInput)) {
                    Map<String, String> specs = fetchVinSpecs(userInput);
                    String specsSummary = summarizeSpecs(specs);
                    conversation.add(
                            mapOf("role", "assistant", "content", "VIN " + userInput + " specs:\n" + specsSummary)
                    );
                }

                conversation.add(mapOf("role", "user", "content", userInput));

                String aiResponse = askOpenAIWithHistory(conversation, apiKey);
                String aiContent = extract(aiResponse, "content");
                if (aiContent == null || aiContent.isBlank()) aiContent = "Sorry — I couldn't generate a response.";

                conversation.add(mapOf("role", "assistant", "content", aiContent));

                String responseJson =
                        "{\"sessionId\":\"" + escapeJson(sessionId) + "\",\"reply\":\"" + escapeJson(aiContent) + "\"}";
                writeJson(exchange, 200, responseJson);
            } catch (Exception e) {
                String err = e.getMessage() == null ? "Unknown error" : e.getMessage();
                writeJson(exchange, 500, "{\"error\":\"" + escapeJson(err) + "\"}");
            }
        }
    }

    private static void addCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "86400");
    }

    private static boolean isPreflight(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return true;
        }
        return false;
    }

    private static void writeJson(HttpExchange exchange, int status, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String readUtf8(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
        }
        return sb.toString();
    }

    private static String extractJsonString(String json, String key) {
        if (json == null) return null;
        String pattern = "\"" + key + "\"";
        int keyIdx = json.indexOf(pattern);
        if (keyIdx < 0) return null;
        int colonIdx = json.indexOf(":", keyIdx + pattern.length());
        if (colonIdx < 0) return null;

        int i = colonIdx + 1;
        while (i < json.length() && Character.isWhitespace(json.charAt(i))) i++;
        if (i >= json.length()) return null;

        if (json.startsWith("null", i)) return null;
        if (json.charAt(i) != '"') return null;
        i++;

        StringBuilder out = new StringBuilder();
        boolean escaping = false;
        while (i < json.length()) {
            char c = json.charAt(i);
            if (escaping) {
                switch (c) {
                    case '"': out.append('"'); break;
                    case '\\': out.append('\\'); break;
                    case '/': out.append('/'); break;
                    case 'b': out.append('\b'); break;
                    case 'f': out.append('\f'); break;
                    case 'n': out.append('\n'); break;
                    case 'r': out.append('\r'); break;
                    case 't': out.append('\t'); break;
                    default: out.append(c); break;
                }
                escaping = false;
                i++;
                continue;
            }
            if (c == '\\') {
                escaping = true;
                i++;
                continue;
            }
            if (c == '"') {
                return out.toString();
            }
            out.append(c);
            i++;
        }
        return null;
    }

    private static Map<String, String> mapOf(String k1, String v1, String k2, String v2) {
        Map<String, String> m = new HashMap<>();
        m.put(k1, v1);
        m.put(k2, v2);
        return m;
    }

    public static boolean isVin(String input) {
        return input != null && input.length() == 17 && input.matches("[A-HJ-NPR-Z0-9]+");
    }

    public static Map<String, String> fetchVinSpecs(String vin) throws IOException {
        String urlStr = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/" + vin + "?format=json";
        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        conn.setRequestMethod("GET");

        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) response.append(line);
        }

        Map<String, String> specs = new HashMap<>();
        specs.put("Make", extract(response.toString(), "Make"));
        specs.put("Model", extract(response.toString(), "Model"));
        specs.put("Year", extract(response.toString(), "ModelYear"));
        specs.put("BodyClass", extract(response.toString(), "BodyClass"));
        specs.put("EngineCylinders", extract(response.toString(), "EngineCylinders"));
        specs.put("FuelTypePrimary", extract(response.toString(), "FuelTypePrimary"));
        specs.put("PlantCity", extract(response.toString(), "PlantCity"));
        specs.put("PlantState", extract(response.toString(), "PlantState"));
        specs.put("PlantCountry", extract(response.toString(), "PlantCountry"));
        return specs;
    }

    public static String summarizeSpecs(Map<String, String> specs) {
        return String.format(
                "Make: %s\nModel: %s\nYear: %s\nBody Class: %s\nEngine Cylinders: %s\nFuel Type: %s\nPlant City: %s\nPlant State: %s\nCountry: %s",
                specs.get("Make"), specs.get("Model"), specs.get("Year"),
                specs.get("BodyClass"), specs.get("EngineCylinders"),
                specs.get("FuelTypePrimary"), specs.get("PlantCity"),
                specs.get("PlantState"), specs.get("PlantCountry")
        );
    }

    public static String askOpenAIWithHistory(List<Map<String, String>> messages, String apiKey) throws Exception {
        URL url = new URL("https://api.openai.com/v1/chat/completions");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setDoOutput(true);
        conn.setConnectTimeout(25_000);
        conn.setReadTimeout(120_000);

        StringBuilder msgJson = new StringBuilder("[");
        for (int i = 0; i < messages.size(); i++) {
            Map<String, String> m = messages.get(i);
            msgJson.append("{")
                    .append("\"role\":\"").append(escapeJson(m.get("role"))).append("\",")
                    .append("\"content\":\"").append(escapeJson(m.get("content"))).append("\"")
                    .append("}");
            if (i < messages.size() - 1) msgJson.append(",");
        }
        msgJson.append("]");

        String json = "{\"model\":\"gpt-4o-mini\",\"messages\":" + msgJson + "}";

        try {
            try (OutputStream os = conn.getOutputStream()) {
                os.write(json.getBytes(StandardCharsets.UTF_8));
            }

            int code = conn.getResponseCode();
            InputStream responseStream = code >= 400 ? conn.getErrorStream() : conn.getInputStream();
            if (responseStream == null && code >= 400) {
                throw new RuntimeException("OpenAI error: HTTP " + code + " (no response body)");
            }
            StringBuilder response = new StringBuilder();
            try (BufferedReader reader =
                         new BufferedReader(new InputStreamReader(responseStream, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) response.append(line);
            }

            if (code >= 400) {
                throw new RuntimeException("OpenAI error: " + response);
            }

            return response.toString();
        } catch (java.net.SocketTimeoutException e) {
            throw new RuntimeException(
                    "OpenAI error: timed out connecting or reading (check network/firewall/VPN). " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(
                    "OpenAI error: could not reach api.openai.com — " + e.getClass().getSimpleName() + ": "
                            + e.getMessage());
        }
    }

    public static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n");
    }

    public static String extract(String text, String key) {
        String pattern = "\"" + key + "\":\"";
        int start = text == null ? -1 : text.indexOf(pattern);
        if (start == -1) return "N/A";

        start += pattern.length();
        int end = text.indexOf("\"", start);
        if (end == -1) return "N/A";
        return text.substring(start, end);
    }
}