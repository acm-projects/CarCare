package com.example.demo.inspections.controller;

import com.example.demo.inspections.dto.RepairVideoDto;
import com.example.demo.inspections.dto.VehicleInfoDto;
import com.example.demo.inspections.service.VinService;
import com.example.demo.inspections.service.YouTubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repair")
public class RepairVideoController {

    private final VinService vinService;
    private final YouTubeService youTubeService;

    public RepairVideoController(VinService vinService, YouTubeService youTubeService) {
        this.vinService = vinService;
        this.youTubeService = youTubeService;
    }

    @GetMapping("/videos")
    public Map<String, Object> getRepairVideos(
            @RequestParam String vin,
            @RequestParam String repairType
    ) {
        VehicleInfoDto vehicle = vinService.decodeVin(vin);
        List<RepairVideoDto> videos = youTubeService.searchRepairVideos(
                vehicle.getYear(),
                vehicle.getMake(),
                vehicle.getModel(),
                repairType
        );

        Map<String, Object> response = new HashMap<>();
        response.put("vehicle", vehicle);
        response.put("repairType", repairType);
        response.put("videos", videos);

        return response;
    }
}