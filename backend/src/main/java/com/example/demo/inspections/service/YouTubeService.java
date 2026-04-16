package com.example.demo.inspections.service;

import com.example.demo.inspections.dto.RepairVideoDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class YouTubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    @Value("${youtube.api.base-url}")
    private String baseUrl;

    @Value("${youtube.api.max-results:5}")
    private int maxResults;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<RepairVideoDto> searchRepairVideos(String year, String make, String model, String repairType) {
        String query = buildQuery(year, make, model, repairType);

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("part", "snippet")
                .queryParam("q", query)
                .queryParam("type", "video")
                .queryParam("maxResults", maxResults)
                .queryParam("key", apiKey)
                .toUriString();



        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        return extractVideos(response);
    }

    private String buildQuery(String year, String make, String model, String repairType) {
        StringBuilder sb = new StringBuilder();

        if (year != null && !year.isBlank()) sb.append(year).append(" ");
        if (make != null && !make.isBlank()) sb.append(make).append(" ");
        if (model != null && !model.isBlank()) sb.append(model).append(" ");
        if (repairType != null && !repairType.isBlank()) sb.append(repairType).append(" ");

        return sb.toString().trim();
    }

    private List<RepairVideoDto> extractVideos(Map<String, Object> response) {
        List<RepairVideoDto> videos = new ArrayList<>();

        if (response == null || !response.containsKey("items")) {
            return videos;
        }

        List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

        for (Map<String, Object> item : items) {
            Map<String, Object> id = (Map<String, Object>) item.get("id");
            Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");

            if (id == null || snippet == null) continue;

            String videoId = (String) id.get("videoId");
            String title = (String) snippet.get("title");
            String description = (String) snippet.get("description");

            String thumbnailUrl = "";
            Map<String, Object> thumbnails = (Map<String, Object>) snippet.get("thumbnails");
            if (thumbnails != null && thumbnails.containsKey("high")) {
                Map<String, Object> highThumb = (Map<String, Object>) thumbnails.get("high");
                if (highThumb != null && highThumb.get("url") != null) {
                    thumbnailUrl = (String) highThumb.get("url");
                }
            } else if (thumbnails != null && thumbnails.containsKey("default")) {
                Map<String, Object> defaultThumb = (Map<String, Object>) thumbnails.get("default");
                if (defaultThumb != null && defaultThumb.get("url") != null) {
                    thumbnailUrl = (String) defaultThumb.get("url");
                }
            }

            String watchUrl = videoId != null ? "https://www.youtube.com/watch?v=" + videoId : "";

            videos.add(new RepairVideoDto(videoId, title, description, thumbnailUrl, watchUrl));
        }

        return videos;
    }
}