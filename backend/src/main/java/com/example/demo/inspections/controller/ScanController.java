package com.example.demo.inspections.controller;

import com.example.demo.inspections.dto.ScanAnalysisResponse;
import com.example.demo.inspections.service.ScanAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/scans")
public class ScanController {

    private final ScanAnalysisService scanAnalysisService;

    public ScanController(ScanAnalysisService scanAnalysisService) {
        this.scanAnalysisService = scanAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ScanAnalysisResponse> analyzeScan(
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        return ResponseEntity.ok(scanAnalysisService.analyze(file));
    }
}