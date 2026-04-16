package com.example.demo.inspections.controller;

import com.example.demo.inspections.dto.ConfirmInspectionRequest;
import com.example.demo.inspections.dto.EstimateItem;
import com.example.demo.inspections.dto.InspectionHeader;
import com.example.demo.inspections.dto.InspectionSectionItem;
import com.example.demo.inspections.dto.ParsedInspectionResult;
import com.example.demo.inspections.dto.ReminderSuggestion;
import com.example.demo.inspections.service.InspectionAiParsingService;
import com.example.demo.inspections.service.InspectionOcrService;
import com.example.demo.inspections.service.InspectionParserService;
import com.example.demo.inspections.service.InspectionStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inspections")
public class InspectionImportController {

    private final InspectionOcrService ocrService;
    private final InspectionParserService parserService;
    private final InspectionAiParsingService aiParsingService;
    private final InspectionStorageService storageService;

    public InspectionImportController(
            InspectionOcrService ocrService,
            InspectionParserService parserService,
            InspectionAiParsingService aiParsingService,
            InspectionStorageService storageService
    ) {
        this.ocrService = ocrService;
        this.parserService = parserService;
        this.aiParsingService = aiParsingService;
        this.storageService = storageService;
    }

    @PostMapping(value = "/ocr/dev", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ParsedInspectionResult devOcr(@RequestPart("file") MultipartFile file) throws Exception {
        String text = ocrService.extractTextFromBytes(file.getBytes());

        InspectionHeader header = parserService.extractHeader(text);
        List<InspectionSectionItem> inspectionSections = parserService.extractInspectionSections(text);
        List<EstimateItem> estimates = parserService.extractEstimates(text);
        String summary = parserService.generateSummary(header, estimates);
        List<ReminderSuggestion> reminders = parserService.buildReminderSuggestions(estimates);

        ParsedInspectionResult result = new ParsedInspectionResult(
                file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename(),
                text,
                header,
                inspectionSections,
                estimates,
                summary,
                reminders
        );

        return aiParsingService.enrichResult(result);
    }

    @PostMapping("/confirm")
    public Map<String, String> confirmInspection(@RequestBody ConfirmInspectionRequest request) throws Exception {
        String inspectionId = storageService.saveInspection(
                request.getUserId(),
                request.getCarId(),
                request.getInspection()
        );

        return Map.of(
                "message", "Inspection saved successfully",
                "inspectionId", inspectionId
        );
    }
}