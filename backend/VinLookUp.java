import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class VinLookUp {
   public VinLookUp() {
   }

   public static void main(String[] var0) {
      String var1 = System.getenv("OPENAI_API_KEY");
      if (var1 != null && !var1.isEmpty()) {
         try {
            Scanner var2 = new Scanner(System.in);

            try {
               System.out.print("Enter VIN: ");
               String var3 = var2.nextLine().trim();
               String var4 = "Identify this vehicle by VIN and list 3-5 common mechanical issues with bullet points: " + var3;
               String var5 = askOpenAI(var4, var1);
               String var6 = extract(var5, "content");
               System.out.println("\n==========================================");
               System.out.println("           AI VEHICLE REPORT             ");
               System.out.println("==========================================");
               System.out.println(var6);
               String var7 = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/" + var3 + "?format=json";
               URL var8 = new URL(var7);
               HttpURLConnection var9 = (HttpURLConnection)var8.openConnection();
               var9.setRequestMethod("GET");
               StringBuilder var10 = new StringBuilder();
               BufferedReader var11 = new BufferedReader(new InputStreamReader(var9.getInputStream()));

               String var12;
               try {
                  while((var12 = var11.readLine()) != null) {
                     var10.append(var12);
                  }
               } catch (Throwable var16) {
                  try {
                     var11.close();
                  } catch (Throwable var15) {
                     var16.addSuppressed(var15);
                  }

                  throw var16;
               }

               var11.close();
               String var19 = var10.toString();
               System.out.println("\n--- Official NHTSA Specifications ---");
               System.out.println("Make:             " + extract(var19, "Make"));
               System.out.println("Model:            " + extract(var19, "Model"));
               System.out.println("Year:             " + extract(var19, "ModelYear"));
               System.out.println("Body Class:       " + extract(var19, "BodyClass"));
               System.out.println("Engine Cylinders: " + extract(var19, "EngineCylinders"));
               System.out.println("Fuel Type:        " + extract(var19, "FuelTypePrimary"));
               System.out.println("Plant City:       " + extract(var19, "PlantCity"));
               System.out.println("Plant State:      " + extract(var19, "PlantState"));
               System.out.println("Country:          " + extract(var19, "PlantCountry"));
               System.out.println("--------------------------------------\n");
            } catch (Throwable var17) {
               try {
                  var2.close();
               } catch (Throwable var14) {
                  var17.addSuppressed(var14);
               }

               throw var17;
            }

            var2.close();
         } catch (Exception var18) {
            System.out.println("An error occurred: " + var18.getMessage());
         }

      } else {
         System.out.println("Error: OPENAI_API_KEY environment variable is not set.");
      }
   }

   public static String extract(String var0, String var1) {
      String var2 = "\"" + var1 + "\":\"";
      int var3 = var0.indexOf(var2);
      if (var3 == -1) {
         var2 = "\"" + var1 + "\": \"";
         var3 = var0.indexOf(var2);
      }

      if (var3 == -1) {
         return "N/A";
      } else {
         var3 += var2.length();

         int var4;
         for(var4 = var0.indexOf("\"", var3); var4 > 0 && var0.charAt(var4 - 1) == '\\'; var4 = var0.indexOf("\"", var4 + 1)) {
         }

         String var5 = var0.substring(var3, var4);
         return var5.replace("\\n", "\n").replace("\\\"", "\"").replace("\\r", "");
      }
   }

   public static String askOpenAI(String var0, String var1) throws Exception {
      URL var2 = new URL("https://api.openai.com/v1/chat/completions");
      HttpURLConnection var3 = (HttpURLConnection)var2.openConnection();
      var3.setRequestMethod("POST");
      var3.setRequestProperty("Content-Type", "application/json");
      var3.setRequestProperty("Authorization", "Bearer " + var1);
      var3.setDoOutput(true);
      String var4 = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"" + var0.replace("\"", "\\\"") + "\"}]}";
      OutputStream var5 = var3.getOutputStream();

      try {
         var5.write(var4.getBytes("utf-8"));
      } catch (Throwable var11) {
         if (var5 != null) {
            try {
               var5.close();
            } catch (Throwable var10) {
               var11.addSuppressed(var10);
            }
         }

         throw var11;
      }

      if (var5 != null) {
         var5.close();
      }

      StringBuilder var13 = new StringBuilder();
      BufferedReader var6 = new BufferedReader(new InputStreamReader(var3.getInputStream()));

      String var7;
      try {
         while((var7 = var6.readLine()) != null) {
            var13.append(var7);
         }
      } catch (Throwable var12) {
         try {
            var6.close();
         } catch (Throwable var9) {
            var12.addSuppressed(var9);
         }

         throw var12;
      }

      var6.close();
      return var13.toString();
   }
}