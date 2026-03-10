package com.example.demo.inspections.service;

import com.example.demo.inspections.dto.VehicleInfoDto;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class VinService {

    public VehicleInfoDto decodeVin(String vin) {
        try {
            String cleanedVin = vin == null ? "" : vin.trim();

            if (cleanedVin.isEmpty()) {
                throw new IllegalArgumentException("VIN is required.");
            }

            String urlString = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/"
                    + cleanedVin
                    + "?format=json";

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

            String make = extractValue(json, "\"Make\":\"", "\"");
            String model = extractValue(json, "\"Model\":\"", "\"");
            String year = extractValue(json, "\"ModelYear\":\"", "\"");

            return new VehicleInfoDto(cleanedVin, year, make, model);

        } catch (Exception e) {
            throw new RuntimeException("Failed to decode VIN.", e);
        }
    }

    private String extractValue(String json, String startToken, String endToken) {
        int start = json.indexOf(startToken);
        if (start == -1) {
            return "";
        }

        start += startToken.length();
        int end = json.indexOf(endToken, start);

        if (end == -1) {
            return "";
        }

        return json.substring(start, end);
    }
}