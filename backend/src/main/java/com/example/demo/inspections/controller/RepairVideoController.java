package com.example.demo.inspections.controller;

import com.example.demo.inspections.dto.RepairVideoDto;
import com.example.demo.inspections.service.YouTubeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/youtube")
public class RepairVideoController {

    private final YouTubeService youTubeService;

    public RepairVideoController(YouTubeService youTubeService) {
        this.youTubeService = youTubeService;
    }

    @GetMapping("/search")
    public List<RepairVideoDto> searchVideos(
            @RequestParam String year,
            @RequestParam String make,
            @RequestParam String model,
            @RequestParam String repairType
    ) {
        return youTubeService.searchRepairVideos(year, make, model, repairType);
    }
}