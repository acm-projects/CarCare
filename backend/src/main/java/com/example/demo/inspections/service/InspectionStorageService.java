package com.example.demo.inspections.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class InspectionStorageService {

    public String saveInspection(String userId, String carId, Map<String, Object> inspectionData) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        String inspectionId = UUID.randomUUID().toString();

        // Ensure user doc exists
        Map<String, Object> userData = new HashMap<>();
        userData.put("uid", userId);
        db.collection("users")
                .document(userId)
                .set(userData);

        // Ensure car doc exists
        Map<String, Object> carData = new HashMap<>();
        carData.put("carId", carId);
        db.collection("users")
                .document(userId)
                .collection("cars")
                .document(carId)
                .set(carData);

        // Save inspection
        db.collection("users")
                .document(userId)
                .collection("cars")
                .document(carId)
                .collection("inspections")
                .document(inspectionId)
                .set(inspectionData);

        return inspectionId;
    }
}