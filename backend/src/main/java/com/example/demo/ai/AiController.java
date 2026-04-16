package com.example.demo.ai;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @PostMapping(value = "/analyze-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String analyzeImage(@RequestPart("file") MultipartFile file) throws Exception {

        byte[] imageBytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        URL url = new URL("https://api.openai.com/v1/responses");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + openaiApiKey);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String prompt = "Classify this car-related image as one of: car_issue_photo, mechanic_sheet, or unknown. Then give a short summary. Return valid JSON only in this format: {\"imageType\":\"...\",\"summary\":\"...\"}";

        String requestBody = "{"
                + "\"model\":\"gpt-4o-mini\","
                + "\"input\":["
                + "  {"
                + "    \"role\":\"user\","
                + "    \"content\":["
                + "      {"
                + "        \"type\":\"input_text\","
                + "        \"text\":\"" + escapeJson(prompt) + "\""
                + "      },"
                + "      {"
                + "        \"type\":\"input_image\","
                + "        \"image_url\":\"data:image/jpeg;base64," + base64Image + "\""
                + "      }"
                + "    ]"
                + "  }"
                + "]"
                + "}";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(requestBody.getBytes(StandardCharsets.UTF_8));
        }

        int status = conn.getResponseCode();

        Scanner scanner;
        if (status >= 200 && status < 300) {
            scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8);
        } else {
            scanner = new Scanner(conn.getErrorStream(), StandardCharsets.UTF_8);
        }

        String response = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
        scanner.close();

        System.out.println("OPENAI STATUS = " + status);
        System.out.println("OPENAI RESPONSE = " + response);

        return response;
    }

    private String escapeJson(String text) {
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }
}