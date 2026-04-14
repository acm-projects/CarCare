package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpenAiTestController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @GetMapping("/openai-test")
    public String testOpenAiKey() {
        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            return "OpenAI key is missing";
        }

        return "OpenAI key loaded successfully";
    }
}