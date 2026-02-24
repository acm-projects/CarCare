import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class VinLookUp {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter VIN: ");
            String vin = scanner.nextLine();

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

            // Extract fields
            System.out.println("\nVehicle Info:");
            System.out.println("Make: " + extract(json, "Make"));
            System.out.println("Model: " + extract(json, "Model"));
            System.out.println("Year: " + extract(json, "ModelYear"));
            System.out.println("Body Class: " + extract(json, "BodyClass"));
            System.out.println("Engine Cylinders: " + extract(json, "EngineCylinders"));
            System.out.println("Fuel Type: " + extract(json, "FuelTypePrimary"));
            System.out.println("Plant City: " + extract(json, "PlantCity"));
            System.out.println("Plant State: " + extract(json, "PlantState"));
            System.out.println("Country: " + extract(json, "PlantCountry"));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Helper function to extract JSON values
    public static String extract(String json, String key) {
        String search = "\"" + key + "\":\"";
        int start = json.indexOf(search);
        if (start == -1) return "N/A";
        start += search.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }
}

