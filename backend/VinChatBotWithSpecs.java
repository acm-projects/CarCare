import java.io.*;
import java.net.*;
import java.util.*;

public class VinChatBotWithSpecs {

    // Conversation history for OpenAI
    static List<Map<String, String>> conversation = new ArrayList<>();

    // Map to store NHTSA data for each VIN
    static Map<String, Map<String, String>> vinData = new HashMap<>();

    public static void main(String[] args) {
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("Error: OPENAI_API_KEY environment variable is not set.");
            return;
        }

        Scanner scanner = new Scanner(System.in);
        System.out.println("=== Welcome to VIN Chatbot with Specs ===");
        System.out.println("You can enter a VIN or ask follow-up questions.");
        System.out.println("Type 'exit' to quit.\n");

        // System message for OpenAI
        conversation.add(Map.of(
            "role", "system",
            "content", "You are a helpful vehicle assistant. Use VIN specifications provided to answer questions accurately."
        ));

        while (true) {
            System.out.print("You: ");
            String userInput = scanner.nextLine().trim();

            if (userInput.equalsIgnoreCase("exit")) {
                System.out.println("Goodbye!");
                break;
            }

            try {
                // If user input looks like a VIN, fetch NHTSA specs
                if (isVin(userInput)) {
                    Map<String, String> specs = fetchVinSpecs(userInput);
                    vinData.put(userInput, specs);

                    String specsSummary = summarizeSpecs(specs);
                    System.out.println("\nOfficial NHTSA Specs:\n" + specsSummary + "\n");

                    // Feed specs to OpenAI as assistant message
                    conversation.add(Map.of(
                        "role", "assistant",
                        "content", "VIN " + userInput + " specs:\n" + specsSummary
                    ));
                }

                // Add user input to conversation
                conversation.add(Map.of("role", "user", "content", userInput));

                // Ask OpenAI
                String aiResponse = askOpenAIWithHistory(conversation, apiKey);
                String aiContent = extract(aiResponse, "content");

                System.out.println("\nAssistant:\n" + aiContent + "\n");

                // Store AI response for context
                conversation.add(Map.of("role", "assistant", "content", aiContent));

            } catch (Exception e) {
                System.out.println("An error occurred: " + e.getMessage());
            }
        }

        scanner.close();
    }

    // Simple check for VIN (17 characters, alphanumeric)
    public static boolean isVin(String input) {
        return input.length() == 17 && input.matches("[A-HJ-NPR-Z0-9]+");
    }

    // Fetches VIN specs from NHTSA API
    public static Map<String, String> fetchVinSpecs(String vin) throws IOException {
        String urlStr = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/" + vin + "?format=json";
        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        conn.setRequestMethod("GET");

        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) response.append(line);
        }

        Map<String, String> specs = new HashMap<>();
        // Extract important fields
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

    // Summarizes specs into readable string
    public static String summarizeSpecs(Map<String, String> specs) {
        return String.format(
            "Make: %s\nModel: %s\nYear: %s\nBody Class: %s\nEngine Cylinders: %s\nFuel Type: %s\nPlant City: %s\nPlant State: %s\nCountry: %s",
            specs.get("Make"), specs.get("Model"), specs.get("Year"), specs.get("BodyClass"),
            specs.get("EngineCylinders"), specs.get("FuelTypePrimary"),
            specs.get("PlantCity"), specs.get("PlantState"), specs.get("PlantCountry")
        );
    }

    // Sends conversation history to OpenAI and returns raw JSON
    public static String askOpenAIWithHistory(List<Map<String, String>> messages, String apiKey) throws Exception {
        URL url = new URL("https://api.openai.com/v1/chat/completions");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setDoOutput(true);

        StringBuilder msgJson = new StringBuilder("[");
        for (int i = 0; i < messages.size(); i++) {
            Map<String, String> m = messages.get(i);
            msgJson.append("{")
                   .append("\"role\":\"").append(m.get("role")).append("\",")
                   .append("\"content\":\"").append(escapeJson(m.get("content"))).append("\"")
                   .append("}");
            if (i < messages.size() - 1) msgJson.append(",");
        }
        msgJson.append("]");

        String json = "{\"model\":\"gpt-4o-mini\",\"messages\":" + msgJson + "}";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(json.getBytes("utf-8"));
        }

        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) response.append(line);
        }

        return response.toString();
    }

    // Escapes JSON special characters
    public static String escapeJson(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    // Extracts value of key from JSON-like string
    public static String extract(String text, String key) {
        String pattern = "\"" + key + "\":\"";
        int start = text.indexOf(pattern);
        if (start == -1) {
            pattern = "\"" + key + "\": \"";
            start = text.indexOf(pattern);
        }
        if (start == -1) return "N/A";

        start += pattern.length();
        int end;
        for (end = text.indexOf("\"", start); end > 0 && text.charAt(end - 1) == '\\';
             end = text.indexOf("\"", end + 1)) {}

        return text.substring(start, end)
                   .replace("\\n", "\n")
                   .replace("\\\"", "\"")
                   .replace("\\r", "");
    }
}