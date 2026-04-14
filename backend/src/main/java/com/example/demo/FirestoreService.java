package com.example.demo;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.Firestore;

@Service
public class FirestoreService {

    private final Firestore firestore;

    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Firestore db() {
        return firestore;
    }

    public Map<String, Object> getCar(String userId, String carId) {
        try {
            var carDoc = firestore.collection("users")
                    .document(userId)
                    .collection("cars")
                    .document(carId)
                    .get()
                    .get();

            if (!carDoc.exists()) {
                return null;
            }

            return carDoc.getData();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch car", e);
        }
    }
}