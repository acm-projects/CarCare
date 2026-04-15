package com.example.demo;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FirestoreService {

    public Firestore db() {
        return FirestoreClient.getFirestore();
    }

    public Map<String, Object> getCar(String userId, String carId) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<DocumentSnapshot> future = db.collection("users")
                    .document(userId)
                    .collection("cars")
                    .document(carId)
                    .get();

            DocumentSnapshot carDoc = future.get();

            if (!carDoc.exists()) {
                return null;
            }

            return carDoc.getData();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch car from Firestore", e);
        }
    }
}