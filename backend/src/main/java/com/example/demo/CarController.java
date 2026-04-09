package com.example.demo;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.inspections.dto.VehicleInfoDto;
import com.example.demo.inspections.service.VinService;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final VinService vinService;
    private final CarStoreService carStoreService;
    private final FirestoreService firestoreService;

    public CarController(VinService vinService, CarStoreService carStoreService, FirestoreService firestoreService) {
        this.vinService = vinService;
        this.carStoreService = carStoreService;
        this.firestoreService = firestoreService;
    }

    @PostMapping("/{vin}")
    public VehicleInfoDto addCar(HttpServletRequest request, @PathVariable String vin) {
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
        if (token == null) {
            throw new RuntimeException("Unauthorized: missing Firebase token");
        }

        String uid = token.getUid();

        VehicleInfoDto dto = vinService.decodeVin(vin);

        Car car = new Car();
        car.setVin(dto.getVin());
        car.setYear(dto.getYear());
        car.setMake(dto.getMake());
        car.setModel(dto.getModel());

        carStoreService.saveCarForUser(uid, car);

        return dto;
    }

    @GetMapping
    public List<Map<String, Object>> getMyCars(HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
        if (token == null) {
            throw new RuntimeException("Unauthorized: missing Firebase token");
        }

        String uid = token.getUid();
        return carStoreService.getCarsForUser(uid);
    }

    @PatchMapping("/{vin}/name")
public Map<String, Object> updateCarName(
        HttpServletRequest request,
        @PathVariable String vin,
        @RequestBody Map<String, Object> body
) {
    FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
    if (token == null) {
        throw new RuntimeException("Unauthorized: missing Firebase token");
    }

    String uid = token.getUid();
    String displayName = body.get("displayName") == null ? "" : body.get("displayName").toString().trim();

    if (displayName.isEmpty()) {
        throw new RuntimeException("displayName is required");
    }

    firestoreService.db()
            .collection("users")
            .document(uid)
            .collection("cars")
            .document(vin)
            .update("displayName", displayName);

    return Map.of("status", "ok", "vin", vin, "displayName", displayName);
}






}