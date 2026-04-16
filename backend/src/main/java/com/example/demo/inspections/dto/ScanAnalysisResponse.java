package com.example.demo.inspections.dto;

import java.util.List;
import java.util.Map;

public class ScanAnalysisResponse {

    private String scanType;
    private String title;
    private String summary;
    private String severity;
    private Double confidence;
    private List<String> possibleCauses;
    private List<String> recommendedActions;
    private List<Map<String, String>> diySuggestions;
    private Map<String, Object> documentData;
    private String rawText;

    public String getScanType() {
        return scanType;
    }

    public void setScanType(String scanType) {
        this.scanType = scanType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public List<String> getPossibleCauses() {
        return possibleCauses;
    }

    public void setPossibleCauses(List<String> possibleCauses) {
        this.possibleCauses = possibleCauses;
    }

    public List<String> getRecommendedActions() {
        return recommendedActions;
    }

    public void setRecommendedActions(List<String> recommendedActions) {
        this.recommendedActions = recommendedActions;
    }

    public List<Map<String, String>> getDiySuggestions() {
        return diySuggestions;
    }

    public void setDiySuggestions(List<Map<String, String>> diySuggestions) {
        this.diySuggestions = diySuggestions;
    }

    public Map<String, Object> getDocumentData() {
        return documentData;
    }

    public void setDocumentData(Map<String, Object> documentData) {
        this.documentData = documentData;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }
}