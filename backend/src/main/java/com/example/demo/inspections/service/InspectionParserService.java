package com.example.demo.inspections.service;

import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class InspectionParserService {

    public record ParsedInspection(String date, Integer mileage) {}

    public ParsedInspection parseInspection(String rawText) {
        String date = find(rawText, "\\b\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}\\b");

        Integer mileage = null;
        String m = findGroup(rawText, "(?i)(?:mileage|odometer)\\D{0,20}(\\d{2,7})");
        if (m == null) m = findGroup(rawText, "(?i)\\b(\\d{2,3},\\d{3})\\b");
        if (m != null) {
            try { mileage = Integer.parseInt(m.replace(",", "")); } catch (Exception ignored) {}
        }

        return new ParsedInspection(date, mileage);
    }

    private String find(String text, String regex) {
        Matcher m = Pattern.compile(regex).matcher(text);
        return m.find() ? m.group(0) : null;
    }

    private String findGroup(String text, String regex) {
        Matcher m = Pattern.compile(regex).matcher(text);
        return m.find() ? m.group(1) : null;
    }
}