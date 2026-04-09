package com.example.demo.inspections.dto;

import java.util.Map;

public class ConfirmInspectionRequest {

    private String userId;
    private String carId;
    private Map<String, Object> inspection;

    public ConfirmInspectionRequest() {
    }

    public String getUserId() {
        return userId;
    }

    public String getCarId() {
        return carId;
    }

    public Map<String, Object> getInspection() {
        return inspection;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public void setInspection(Map<String, Object> inspection) {
        this.inspection = inspection;
    }
}