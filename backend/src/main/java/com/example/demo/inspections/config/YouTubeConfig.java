package com.example.demo.inspections.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class YouTubeConfig {

    @Value("${youtube.api.key:}")
    private String apiKey;

    @Value("${youtube.api.base-url:https://www.googleapis.com/youtube/v3}")
    private String baseUrl;

    @Value("${youtube.api.max-results:5}")
    private int maxResults;

    public String getApiKey() {
        return apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public int getMaxResults() {
        return maxResults;
    }
}