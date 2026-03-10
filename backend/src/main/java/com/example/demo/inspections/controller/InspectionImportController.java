package com.example.demo.inspections.controller;

import com.example.demo.inspections.service.InspectionOcrService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/inspections")
public class InspectionImportController {

    private final InspectionOcrService ocrService;

    public InspectionImportController(InspectionOcrService ocrService) {
        this.ocrService = ocrService;
    }

    // DEV ONLY: upload an image and get extracted text back
    @PostMapping(value = "/ocr/dev", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> devOcr(@RequestPart("file") MultipartFile file) throws Exception {
        String text = ocrService.extractTextFromBytes(file.getBytes());
        return Map.of(
                "filename", (file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename()),                "text", text
        );
    }
}