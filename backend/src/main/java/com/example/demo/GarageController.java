package com.example.demo;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/garage/vehicles")
public class GarageController {

    private final VinService vinService;
    private final CarStoreService carStoreService;

    public GarageController(VinService vinService, CarStoreService carStoreService) {
        this.vinService = vinService;
        this.carStoreService = carStoreService;
    }

    @GetMapping
    public List<Map<String, Object>> listGarage(HttpServletRequest request) {
        FirebaseToken token = requireToken(request);
        String uid = token.getUid();
        List<Map<String, Object>> stored = carStoreService.getCarsForUser(uid);
        List<Map<String, Object>> out = new ArrayList<>(stored.size());
        for (Map<String, Object> row : stored) {
            out.add(toGarageVehicle(row));
        }
        return out;
    }

    @PostMapping
    public Map<String, Object> addByVin(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        FirebaseToken token = requireToken(request);
        String uid = token.getUid();
        Object vinObj = body == null ? null : body.get("vin");
        String vin = vinObj == null ? "" : vinObj.toString().trim();
        VehicleInfoDto dto = vinService.decodeVin(vin);

        Car car = new Car();
        car.setVin(dto.getVin());
        car.setYear(dto.getYear());
        car.setMake(dto.getMake());
        car.setModel(dto.getModel());

        carStoreService.saveCarForUser(uid, car);

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", dto.getVin());
        row.put("vin", dto.getVin());
        row.put("displayName", defaultDisplayName(dto.getVin()));
        row.put("subtitle", subtitle(dto.getYear(), dto.getMake(), dto.getModel()));
        row.put("imageUrl", null);
        row.put("services", new ArrayList<>());
        return row;
    }

    @DeleteMapping("/{id}")
    public void remove(HttpServletRequest request, @PathVariable String id) {
        FirebaseToken token = requireToken(request);
        carStoreService.deleteCarForUser(token.getUid(), id);
    }

    private static FirebaseToken requireToken(HttpServletRequest request) {
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
        if (token == null) {
            throw new RuntimeException("Unauthorized: missing Firebase token");
        }
        return token;
    }

    private static Map<String, Object> toGarageVehicle(Map<String, Object> stored) {
        String id = str(stored.get("id"));
        String vin = str(stored.get("vin"));
        if (vin.isEmpty()) {
            vin = id;
        }
        if (id.isEmpty()) {
            id = vin;
        }
        String displayName = str(stored.get("displayName"));
        if (displayName.isBlank()) {
            displayName = defaultDisplayName(vin);
        }
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("vin", vin);
        m.put("displayName", displayName);
        m.put("subtitle", subtitle(str(stored.get("year")), str(stored.get("make")), str(stored.get("model"))));
        Object img = stored.get("imageUrl");
        m.put("imageUrl", img == null ? null : img.toString());
        m.put("services", new ArrayList<>());
        return m;
    }

    private static String defaultDisplayName(String vin) {
        String v = vin == null ? "" : vin.trim().toUpperCase();
        if (v.length() >= 4) {
            return "My vehicle (" + v.substring(v.length() - 4) + ")";
        }
        return "My vehicle";
    }

    private static String subtitle(String year, String make, String model) {
        return (year + " " + make + " " + model).trim();
    }

    private static String str(Object o) {
        return o == null ? "" : o.toString();
    }
}
