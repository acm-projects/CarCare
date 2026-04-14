package com.example.demo.inspections.dto;

import java.util.List;

public class ParsedInspectionResult {

    private String filename;
    private String rawText;
    private InspectionHeader header;
    private List<InspectionSectionItem> inspectionSections;
    private List<EstimateItem> estimates;
    private String summary;
    private List<ReminderSuggestion> recommendedReminders;

    public ParsedInspectionResult(
            String filename,
            String rawText,
            InspectionHeader header,
            List<InspectionSectionItem> inspectionSections,
            List<EstimateItem> estimates,
            String summary,
            List<ReminderSuggestion> recommendedReminders
    ) {
        this.filename = filename;
        this.rawText = rawText;
        this.header = header;
        this.inspectionSections = inspectionSections;
        this.estimates = estimates;
        this.summary = summary;
        this.recommendedReminders = recommendedReminders;
    }

    public String getFilename() {
        return filename;
    }

    public String getRawText() {
        return rawText;
    }

    public InspectionHeader getHeader() {
        return header;
    }

    public List<InspectionSectionItem> getInspectionSections() {
        return inspectionSections;
    }

    public List<EstimateItem> getEstimates() {
        return estimates;
    }

    public String getSummary() {
        return summary;
    }

    public List<ReminderSuggestion> getRecommendedReminders() {
        return recommendedReminders;
    }
}