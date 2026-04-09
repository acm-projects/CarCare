package com.example.demo.inspections.service;

import com.example.demo.inspections.dto.EstimateItem;
import com.example.demo.inspections.dto.InspectionHeader;
import com.example.demo.inspections.dto.InspectionSectionItem;
import com.example.demo.inspections.dto.ReminderSuggestion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class InspectionParserService {

    public InspectionHeader extractHeader(String text) {
        String businessName = extractLineValue(text, "(?i)Business Name:\\s*(.+)");
        String technician = extractLineValue(text, "(?i)Technician:\\s*(.+)");
        String customerName = extractLineValue(text, "(?i)Customer Name:\\s*(.+)");
        String date = extractDate(text);
        String yearMakeModel = extractLineValue(text, "(?i)Yr/Make/Model:\\s*(.+)");
        String vin = extractLineValue(text, "(?i)VIN:\\s*([A-Z0-9]+)");
        String mileage = extractMileage(text);
        String repairOrderNumber = extractLineValue(text, "(?i)Repair Order\\s*#\\s*(\\S+)");

        return new InspectionHeader(
                businessName,
                technician,
                customerName,
                date,
                yearMakeModel,
                vin,
                mileage,
                repairOrderNumber
        );
    }

    public String extractMileage(String text) {
        Pattern pattern = Pattern.compile("(?i)Mileage:\\s*([\\d,]+)");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1).replace(",", "");
        }

        Pattern fallback = Pattern.compile("\\b(\\d{1,3},\\d{3})\\b");
        Matcher fallbackMatcher = fallback.matcher(text);
        if (fallbackMatcher.find()) {
            return fallbackMatcher.group(1).replace(",", "");
        }

        return "Unknown";
    }

    public String extractDate(String text) {
        Pattern pattern = Pattern.compile("(?i)Date:\\s*(\\d{1,2}/\\d{1,2}/\\d{2,4})");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1);
        }

        Pattern fallback = Pattern.compile("\\b(\\d{1,2}/\\d{1,2}/\\d{2,4})\\b");
        Matcher fallbackMatcher = fallback.matcher(text);
        if (fallbackMatcher.find()) {
            return fallbackMatcher.group(1);
        }

        return "Unknown";
    }

    public List<InspectionSectionItem> extractInspectionSections(String text) {
        List<InspectionSectionItem> items = new ArrayList<>();

        String[] lines = text.split("\\r?\\n");
        String currentSection = null;

        for (String rawLine : lines) {
            String line = rawLine.trim();

            if (line.isEmpty()) {
                continue;
            }

            if (isSectionHeading(line)) {
                currentSection = normalizeSectionHeading(line);
                continue;
            }

            if (currentSection == null) {
                continue;
            }

            if (shouldSkipLine(line)) {
                continue;
            }

            items.add(new InspectionSectionItem(currentSection, line, "UNKNOWN"));
        }

        return items;
    }

    public List<EstimateItem> extractEstimates(String text) {
        List<EstimateItem> estimates = new ArrayList<>();
        String[] lines = text.split("\\r?\\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();

            if (!line.contains("=")) {
                continue;
            }

            String item = line.substring(0, line.indexOf('=')).trim();
            String price = "";

            if (i + 1 < lines.length) {
                String nextLine = lines[i + 1].trim();
                if (nextLine.matches("\\$?[\\d,]+\\.\\d{2}")) {
                    price = nextLine.startsWith("$") ? nextLine : "$" + nextLine;
                }
            }

            if (!item.isEmpty()) {
                estimates.add(new EstimateItem(item, price));
            }
        }

        return estimates;
    }

    public String generateSummary(InspectionHeader header, List<EstimateItem> estimates) {
        List<String> parts = new ArrayList<>();

        if (!"Unknown".equals(header.getMileage())) {
            parts.add("Mileage " + header.getMileage());
        }

        if (!"Unknown".equals(header.getDate())) {
            parts.add("inspection date " + header.getDate());
        }

        if (!estimates.isEmpty()) {
            List<String> estimateNames = new ArrayList<>();
            for (int i = 0; i < estimates.size() && i < 3; i++) {
                estimateNames.add(estimates.get(i).getItem());
            }
            parts.add("recommended work includes " + String.join(", ", estimateNames));
        }

        if (parts.isEmpty()) {
            return "Inspection parsed successfully.";
        }

        return "Inspection summary: " + String.join("; ", parts) + ".";
    }

    public List<ReminderSuggestion> buildReminderSuggestions(List<EstimateItem> estimates) {
        List<ReminderSuggestion> reminders = new ArrayList<>();

        for (EstimateItem estimate : estimates) {
            String lower = estimate.getItem().toLowerCase();

            if (lower.contains("oil")) {
                reminders.add(new ReminderSuggestion("Oil Change", "soon", "Schedule within 1 to 2 weeks"));
            } else if (lower.contains("brake")) {
                reminders.add(new ReminderSuggestion("Brake Service", "soon", "Inspect or service within 1 week"));
            } else if (lower.contains("air filter")) {
                reminders.add(new ReminderSuggestion("Replace Engine Air Filter", "soon", "Replace at next service visit"));
            } else if (lower.contains("wiper")) {
                reminders.add(new ReminderSuggestion("Replace Wiper Blades", "soon", "Replace before next rain period"));
            } else {
                reminders.add(new ReminderSuggestion(estimate.getItem(), "soon", "Review recommended service"));
            }
        }

        return reminders;
    }

    private String extractLineValue(String text, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        return "Unknown";
    }

    private boolean isSectionHeading(String line) {
        String upper = line.toUpperCase();
        return upper.equals("INTERIOR/EXTERIOR")
                || upper.equals("UNDER VEHICLE")
                || upper.equals("UNDER HOOD")
                || upper.equals("BATTERY PERFORMANCE");
    }

    private String normalizeSectionHeading(String line) {
        return line.replaceAll("\\s+", " ").trim();
    }

    private boolean shouldSkipLine(String line) {
        String lower = line.toLowerCase();

        return lower.contains("checked and okay")
                || lower.contains("may need future attention")
                || lower.contains("requires immediate attention")
                || lower.contains("battery cold cranking amps")
                || lower.startsWith("factory specs")
                || lower.startsWith("actual:")
                || lower.equals("comments / estimates")
                || lower.equals("prior body damage")
                || lower.equals("brake and tire");
    }
}