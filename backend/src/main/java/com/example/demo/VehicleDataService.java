package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class VehicleDataService {

    private final FirestoreService firestoreService;

    public VehicleDataService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public Map<String, Object> getVehicleById(String userId, String vehicleId) {
        return firestoreService.getCar(userId, vehicleId);
    }

    public String buildYoutubeSearchQuery(String userId, String vehicleId, String repairTopic) {

        Map<String, Object> car = firestoreService.getCar(userId, vehicleId);

        if (car == null) {
            return null;
        }

        String year = String.valueOf(car.get("year"));
        String make = String.valueOf(car.get("make"));
        String model = String.valueOf(car.get("model"));

        return year + " " + make + " " + model + " " + repairTopic + " repair";
    }
}