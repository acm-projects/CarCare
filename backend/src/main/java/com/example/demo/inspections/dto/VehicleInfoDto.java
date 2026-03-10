package com.example.demo.inspections.dto;

public class VehicleInfoDto {

    private String vin;
    private String year;
    private String make;
    private String model;

    public VehicleInfoDto() {
    }

    public VehicleInfoDto(String vin, String year, String make, String model) {
        this.vin = vin;
        this.year = year;
        this.make = make;
        this.model = model;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}