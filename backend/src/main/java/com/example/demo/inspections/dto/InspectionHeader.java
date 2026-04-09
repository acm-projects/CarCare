package com.example.demo.inspections.dto;

public class InspectionHeader {

    private String businessName;
    private String technician;
    private String customerName;
    private String date;
    private String yearMakeModel;
    private String vin;
    private String mileage;
    private String repairOrderNumber;

    public InspectionHeader(
            String businessName,
            String technician,
            String customerName,
            String date,
            String yearMakeModel,
            String vin,
            String mileage,
            String repairOrderNumber
    ) {
        this.businessName = businessName;
        this.technician = technician;
        this.customerName = customerName;
        this.date = date;
        this.yearMakeModel = yearMakeModel;
        this.vin = vin;
        this.mileage = mileage;
        this.repairOrderNumber = repairOrderNumber;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getTechnician() {
        return technician;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getDate() {
        return date;
    }

    public String getYearMakeModel() {
        return yearMakeModel;
    }

    public String getVin() {
        return vin;
    }

    public String getMileage() {
        return mileage;
    }

    public String getRepairOrderNumber() {
        return repairOrderNumber;
    }
}