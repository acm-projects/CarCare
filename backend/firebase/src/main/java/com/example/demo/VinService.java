package com.example.demo;

import org.springframework.stereotype.Service;
import java.io.*;
import java.net.*;

@Service
public class VinService {

    public Car decodeVin(String vin) {
        try {
            String urlString = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/"
                    + vin + "?format=json";

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
            );

            String line;
            StringBuilder response = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            reader.close();

            String json = response.toString();

            Car car = new Car();
            car.setVin(vin);
            car.setMake(extract(json, "Make"));
            car.setModel(extract(json, "Model"));
            car.setYear(extract(json, "ModelYear"));
            car.setBodyClass(extract(json, "BodyClass"));
            car.setFuelType(extract(json, "FuelTypePrimary"));
            car.setEngineCylinders(extract(json, "EngineCylinders"));
            car.setPlantCity(extract(json, "PlantCity"));
            car.setPlantState(extract(json, "PlantState"));
            car.setPlantCountry(extract(json, "PlantCountry"));

            return car;

        } catch (Exception e) {
            throw new RuntimeException("VIN lookup failed");
        }
    }

    private String extract(String json, String key) {
        String search = "\"" + key + "\":\"";
        int start = json.indexOf(search);
        if (start == -1) return "N/A";
        start += search.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }
}