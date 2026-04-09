package com.example.demo.inspections.dto;

public class ReminderSuggestion {

    private String title;
    private String dueType;
    private String note;

    public ReminderSuggestion(String title, String dueType, String note) {
        this.title = title;
        this.dueType = dueType;
        this.note = note;
    }

    public String getTitle() {
        return title;
    }

    public String getDueType() {
        return dueType;
    }

    public String getNote() {
        return note;
    }
}