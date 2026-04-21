 package com.example.demo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;

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
        data.put("displayName", car.getDisplayName());

        try {
            ApiFuture<?> write = doc.set(data);
            write.get();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save car", e);
        }
    }

    public List<Map<String, Object>> getCarsForUser(String uid) {
    try {
        QuerySnapshot snapshot = firestore
                .collection("users")
                .document(uid)
                .collection("cars")
                .get()
                .get();

        List<Map<String, Object>> cars = new ArrayList<>();

        for (QueryDocumentSnapshot doc : snapshot.getDocuments()) {
            Map<String, Object> data = new HashMap<>(doc.getData());
            data.put("id", doc.getId());
            cars.add(data);
        }

        return cars;
    } catch (Exception e) {
        throw new RuntimeException("Failed to get cars: " + e.getMessage(), e);
    }
    }

    public void deleteCarForUser(String uid, String vehicleId) {
        try {
            firestore
                    .collection("users")
                    .document(uid)
                    .collection("cars")
                    .document(vehicleId)
                    .delete()
                    .get();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete car: " + e.getMessage(), e);
        }
    }
}