package com.example.demo.inspections.controller;

import com.example.demo.inspections.dto.OcrResult;
import com.example.demo.inspections.service.InspectionOcrService;
import com.example.demo.inspections.service.OcrParsingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/inspections")
public class InspectionImportController {

    private final InspectionOcrService ocrService;
    private final OcrParsingService ocrParsingService;

    public InspectionImportController(
            InspectionOcrService ocrService,
            OcrParsingService ocrParsingService
    ) {
        this.ocrService = ocrService;
        this.ocrParsingService = ocrParsingService;
    }

    @PostMapping(value = "/ocr/dev", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public OcrResult devOcr(@RequestPart("file") MultipartFile file) throws Exception {
        OcrResult result = ocrService.extractOcrResult(
                file.getBytes(),
                file.getOriginalFilename()
        );

        String parsedText = ocrParsingService.parseWithAI(result.getRawText());

        return new OcrResult(
                result.isSuccess(),
                result.getFilename(),
                parsedText,
                "OCR extracted and passed through parsing layer"
        );
    }
}