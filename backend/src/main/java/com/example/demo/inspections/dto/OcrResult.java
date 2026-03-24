package com.example.demo.inspections.dto;

public class OcrResult {

    private boolean success;
    private String filename;
    private String rawText;
    private String message;

    public OcrResult(boolean success, String filename, String rawText, String message) {
        this.success = success;
        this.filename = filename;
        this.rawText = rawText;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getFilename() {
        return filename;
    }

    public String getRawText() {
        return rawText;
    }

    public String getMessage() {
        return message;
    }
}