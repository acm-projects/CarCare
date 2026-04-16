package com.example.demo.inspections.service;

import com.example.demo.inspections.dto.ParsedInspectionResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InspectionAiParsingService {

    @Value("${inspection.ai.enabled:false}")
    private boolean aiEnabled;

    public ParsedInspectionResult enrichResult(ParsedInspectionResult result) {
        if (!aiEnabled) {
            return result;
        }

        // Placeholder for future AI enrichment
        return result;
    }
}