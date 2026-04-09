package com.example.demo.inspections.dto;

public class EstimateItem {

    private String item;
    private String price;

    public EstimateItem(String item, String price) {
        this.item = item;
        this.price = price;
    }

    public String getItem() {
        return item;
    }

    public String getPrice() {
        return price;
    }
}