package com.example.demo.inspections.service;

import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.TextAnnotation;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InspectionOcrService {

    public String extractTextFromBytes(byte[] bytes) throws Exception {
        ByteString imgBytes = ByteString.copyFrom(bytes);

        Image image = Image.newBuilder()
                .setContent(imgBytes)
                .build();

        Feature feature = Feature.newBuilder()
                .setType(Feature.Type.DOCUMENT_TEXT_DETECTION)
                .build();

        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feature)
                .setImage(image)
                .build();

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(List.of(request));
            AnnotateImageResponse res = response.getResponses(0);

            if (res.hasError()) {
                throw new RuntimeException("OCR error: " + res.getError().getMessage());
            }

            TextAnnotation annotation = res.getFullTextAnnotation();
            if (annotation == null || annotation.getText() == null) {
                return "";
            }
            return annotation.getText();
        }
    }
}