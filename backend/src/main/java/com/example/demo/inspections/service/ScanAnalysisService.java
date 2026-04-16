package com.example.demo.inspections.service;

import com.example.demo.inspections.dto.ScanAnalysisResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class ScanAnalysisService {

    private final InspectionOcrService inspectionOcrService;

    public ScanAnalysisService(InspectionOcrService inspectionOcrService) {
        this.inspectionOcrService = inspectionOcrService;
    }

    public ScanAnalysisResponse analyze(MultipartFile file) throws Exception {
        String text = inspectionOcrService.extractTextFromBytes(file.getBytes());

        System.out.println("OCR TEXT: " + text);

        ScanAnalysisResponse response = new ScanAnalysisResponse();
        String lower = text == null ? "" : text.toLowerCase();

        response.setRawText(text);

        if (lower.length() > 100 ||
                lower.contains("inspection") ||
                lower.contains("recommended") ||
                lower.contains("mileage") ||
                lower.contains("service")) {

            response.setScanType("MECHANIC_DOCUMENT");
            response.setTitle("Inspection Report");
            response.setSummary("This looks like a mechanic inspection or service document.");
            response.setSeverity("INFO");
            response.setConfidence(0.9);

            response.setPossibleCauses(List.of());

            response.setRecommendedActions(List.of(
                    "Review urgent service items",
                    "Confirm mileage and service recommendations",
                    "Save useful items to the service timeline"
            ));

            response.setDiySuggestions(List.of(
                    Map.of("label", "Oil change videos", "repairType", "oil change"),
                    Map.of("label", "Brake repair videos", "repairType", "brake pad replacement")
            ));

            response.setDocumentData(Map.of(
                    "mileage", extractMileage(text),
                    "hasOilMention", String.valueOf(lower.contains("oil")),
                    "hasBrakeMention", String.valueOf(lower.contains("brake")),
                    "hasTireMention", String.valueOf(lower.contains("tire"))
            ));

        } else {
            response.setScanType("DASHBOARD_WARNING");
            response.setConfidence(0.75);
            response.setDocumentData(null);

            if (lower.contains("engine") || lower.contains("check")) {
                response.setTitle("Check Engine Light");
                response.setSummary("Your car may have an engine or emissions issue.");
                response.setSeverity("MEDIUM");

                response.setPossibleCauses(List.of(
                        "Loose gas cap",
                        "O2 sensor issue",
                        "Ignition coil or spark plug issue",
                        "Mass airflow sensor issue"
                ));

                response.setRecommendedActions(List.of(
                        "Tighten the gas cap",
                        "Scan the vehicle with an OBD2 reader",
                        "Watch for shaking, power loss, or a flashing light"
                ));

                response.setDiySuggestions(List.of(
                        Map.of("label", "Diagnosis videos", "repairType", "check engine light diagnosis"),
                        Map.of("label", "Spark plug videos", "repairType", "spark plug replacement")
                ));
            } else {
                response.setTitle("Vehicle Issue Detected");
                response.setSummary("We detected a possible issue, but need more info.");
                response.setSeverity("UNKNOWN");

                response.setPossibleCauses(List.of(
                        "Dashboard warning light",
                        "Mechanical issue not clearly visible",
                        "Photo may need better lighting or angle"
                ));

                response.setRecommendedActions(List.of(
                        "Retake the photo with better lighting",
                        "Capture the full dashboard or affected area",
                        "Get the issue checked if the warning stays on"
                ));

                response.setDiySuggestions(List.of(
                        Map.of("label", "General diagnostic videos", "repairType", "car warning light diagnosis")
                ));
            }
        }

        return response;
    }

    private String extractMileage(String rawText) {
        if (rawText == null) {
            return null;
        }

        String[] tokens = rawText.split("\\s+");
        for (String token : tokens) {
            String cleaned = token.replaceAll("[^0-9]", "");
            if (cleaned.length() >= 4 && cleaned.length() <= 6) {
                return cleaned;
            }
        }
        return null;
    }
}