package com.example.demo.inspections.service;

import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@Service
public class InspectionStorageService {



    public record StoredObject(String bucketName, String objectPath, String gsUri) {}

    public StoredObject uploadSheet(String uid, String carId, String inspectionId, MultipartFile file) throws Exception {
        Bucket bucket = StorageClient.getInstance().bucket();
        String bucketName = bucket.getName();

        String objectPath =
                "users/" + uid + "/cars/" + carId + "/inspection-imports/" + inspectionId + "/sheet.jpg";

        String contentType = Objects.requireNonNullElse(file.getContentType(), "image/jpeg");
        bucket.create(objectPath, file.getBytes(), contentType);

        String gsUri = "gs://" + bucketName + "/" + objectPath;
        return new StoredObject(bucketName, objectPath, gsUri);
    }
}