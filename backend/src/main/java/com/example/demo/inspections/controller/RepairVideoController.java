package com.example.demo.inspections.controller;

import com.example.demo.VehicleDataService;
import com.example.demo.inspections.dto.RepairVideoDto;
import com.example.demo.inspections.service.YouTubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RepairVideoController {

    private final VehicleDataService vehicleDataService;
    private final YouTubeService youTubeService;

    public RepairVideoController(VehicleDataService vehicleDataService, YouTubeService youTubeService) {
        this.vehicleDataService = vehicleDataService;
        this.youTubeService = youTubeService;
    }

    @GetMapping("/repair-videos")
    public List<RepairVideoDto> getRepairVideos(
            @RequestParam String userId,
            @RequestParam String vehicleId,
            @RequestParam String repairType
    ) {
        System.out.println("REPAIR VIDEOS HIT");
        System.out.println("userId = " + userId);
        System.out.println("vehicleId = " + vehicleId);
        System.out.println("repairType = " + repairType);

        String query = vehicleDataService.buildYoutubeSearchQuery(userId, vehicleId, repairType);
        System.out.println("built query = " + query);

        if (query == null) {
            throw new RuntimeException("Vehicle not found or query could not be built");
        }

        String[] parts = query.split(" ", 4);
        String year = parts.length > 0 ? parts[0] : "";
        String make = parts.length > 1 ? parts[1] : "";
        String model = parts.length > 2 ? parts[2] : "";
        String finalRepairType = repairType;

        List<RepairVideoDto> videos = youTubeService.searchRepairVideos(year, make, model, finalRepairType);
        System.out.println("videos returned = " + videos.size());

        return videos;
    }
}