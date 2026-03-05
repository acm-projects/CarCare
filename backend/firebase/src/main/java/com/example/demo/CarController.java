package com.example.demo;

import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final VinService vinService;
    private final CarStoreService carStoreService;

    public CarController(VinService vinService, CarStoreService carStoreService) {
        this.vinService = vinService;
        this.carStoreService = carStoreService;
    }

    @PostMapping("/{vin}")
    public Car addCar(HttpServletRequest request, @PathVariable String vin) {

        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
        if (token == null) throw new RuntimeException("Missing firebaseToken attribute (auth filter not setting it)");

        String uid = token.getUid();

        Car car = vinService.decodeVin(vin);
        carStoreService.saveCarForUser(uid, car);

        return car;
    }


}