package com.example.demo;

public class Car {

    private String vin;
    private String make;
    private String model;
    private String year;
    private String bodyClass;
    private String engineCylinders;
    private String fuelType;
    private String plantCity;
    private String plantState;
    private String plantCountry;

    public Car() {}

    // ADD THESE ↓↓↓

    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getBodyClass() { return bodyClass; }
    public void setBodyClass(String bodyClass) { this.bodyClass = bodyClass; }

    public String getEngineCylinders() { return engineCylinders; }
    public void setEngineCylinders(String engineCylinders) { this.engineCylinders = engineCylinders; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getPlantCity() { return plantCity; }
    public void setPlantCity(String plantCity) { this.plantCity = plantCity; }

    public String getPlantState() { return plantState; }
    public void setPlantState(String plantState) { this.plantState = plantState; }

    public String getPlantCountry() { return plantCountry; }
    public void setPlantCountry(String plantCountry) { this.plantCountry = plantCountry; }
}
