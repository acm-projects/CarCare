package com.example.demo.inspections.service;

import com.example.demo.inspections.dto.RepairVideoDto;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class YouTubeService {

    private static final String API_KEY = "AIzaSyDZ8ZXJ-Ng4z5o8WsmVnHGwaZx-jmROQs0";
    private static final String BASE_URL = "https://www.googleapis.com/youtube/v3";
    private static final int MAX_RESULTS = 5;

    public List<RepairVideoDto> searchRepairVideos(String year, String make, String model, String repairType) {
        List<RepairVideoDto> videos = new ArrayList<>();

        try {
            String query = year + " " + make + " " + model + " " + repairType + " repair";
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);

            String urlString = BASE_URL
                    + "/search?part=snippet&type=video&maxResults="
                    + MAX_RESULTS
                    + "&q="
                    + encodedQuery
                    + "&key="
                    + API_KEY;

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
            );

            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            reader.close();

            String json = response.toString();
            String[] parts = json.split("\"videoId\": \"");

            for (int i = 1; i < parts.length && videos.size() < MAX_RESULTS; i++) {
                String videoId = parts[i].substring(0, parts[i].indexOf("\""));
                String videoUrl = "https://www.youtube.com/watch?v=" + videoId;

                videos.add(new RepairVideoDto(
                        videoId,
                        "YouTube Repair Video",
                        "",
                        "",
                        videoUrl
                ));
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch YouTube videos.", e);
        }

        return videos;
    }
}