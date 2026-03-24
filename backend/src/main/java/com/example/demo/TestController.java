package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/start")
    public String Start() {
        return "Hey I am working fine.";
    }

    @GetMapping("/test-car")
    public String testCar() {
        FirestoreService firestoreService = new FirestoreService();

        Object car = firestoreService.getCar(
                "AKIiy6bhptbENCSfwFiztG6D0zl1",
                "1HGCM82633A004352"
        );

        System.out.println("CAR RESULT = " + car);

        return String.valueOf(car);
    }

    @GetMapping("/youtube-query")
    public String youtubeQuery() {

        VehicleDataService vehicleDataService = new VehicleDataService(new FirestoreService());

        return vehicleDataService.buildYoutubeSearchQuery(
                "AKIiy6bhptbENCSfwFiztG6D0zl1",
                "1HGCM82633A004352",
                "oil change"
        );
    }
}


