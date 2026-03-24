package com.example.demo;

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
            var userDoc = db().collection("users")
                    .document(userId)
                    .get()
                    .get();

            System.out.println("USER EXISTS = " + userDoc.exists());

            var carDoc = db().collection("users")
                    .document(userId)
                    .collection("cars")
                    .document(carId)
                    .get()
                    .get();

            System.out.println("CAR EXISTS = " + carDoc.exists());

            if (!carDoc.exists()) {
                return null;
            }

            return carDoc.getData();

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch car", e);
        }
    }
}