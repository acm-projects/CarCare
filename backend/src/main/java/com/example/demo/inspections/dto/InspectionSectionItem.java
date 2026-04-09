package com.example.demo.inspections.dto;

public class InspectionSectionItem {

    private String section;
    private String item;
    private String status;

    public InspectionSectionItem(String section, String item, String status) {
        this.section = section;
        this.item = item;
        this.status = status;
    }

    public String getSection() {
        return section;
    }

    public String getItem() {
        return item;
    }

    public String getStatus() {
        return status;
    }
}