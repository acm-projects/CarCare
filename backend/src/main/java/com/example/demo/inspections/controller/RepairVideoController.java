package com.example.demo.inspections.controller;

import com.example.demo.VehicleDataService;
import com.example.demo.inspections.dto.RepairVideoDto;
import com.example.demo.inspections.service.YouTubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class RepairVideoController {

    private final VehicleDataService vehicleDataService;
    private final YouTubeService youTubeService;

    public RepairVideoController(
            VehicleDataService vehicleDataService,
            YouTubeService youTubeService
    ) {
        this.vehicleDataService = vehicleDataService;
        this.youTubeService = youTubeService;
    }

    @GetMapping("/repair-videos")
    public List<RepairVideoDto> getRepairVideos() {

        String userId = "AKIiy6bhptbENCSfwFiztG6D0zl1";
        String vehicleId = "1HGCM82633A004352";
        String repairType = "oil change";

        Map<String, Object> car = vehicleDataService.getVehicleById(userId, vehicleId);

        if (car == null) {
            throw new RuntimeException("Car not found in Firestore");
        }

        String year = String.valueOf(car.get("year"));
        String make = String.valueOf(car.get("make"));
        String model = String.valueOf(car.get("model"));

        return youTubeService.searchRepairVideos(year, make, model, repairType);
    }
}