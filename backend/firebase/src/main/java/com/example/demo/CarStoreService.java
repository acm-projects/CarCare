package com.example.demo;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CarStoreService {

    private final Firestore firestore;

    public CarStoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public void saveCarForUser(String uid, Car car) {
        DocumentReference doc = firestore
                .collection("users").document(uid)
                .collection("cars").document(car.getVin());

        Map<String, Object> data = new HashMap<>();
        data.put("vin", car.getVin());
        data.put("make", car.getMake());
        data.put("model", car.getModel());
        data.put("year", car.getYear());
        data.put("bodyClass", car.getBodyClass());
        data.put("engineCylinders", car.getEngineCylinders());
        data.put("fuelType", car.getFuelType());
        data.put("plantCity", car.getPlantCity());
        data.put("plantState", car.getPlantState());
        data.put("plantCountry", car.getPlantCountry());
        data.put("createdAt", System.currentTimeMillis());

        try {
            ApiFuture<?> write = doc.set(data);
            write.get();
        } catch (Exception e) {
            throw new RuntimeException("Failed to save car: " + e.getMessage());
        }
    }
}