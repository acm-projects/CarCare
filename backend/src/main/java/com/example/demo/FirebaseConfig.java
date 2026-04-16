package com.example.demo;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) return;

        try {
            String credsPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
            System.out.println("GOOGLE_APPLICATION_CREDENTIALS = " + credsPath);
            System.out.println("FILE EXISTS = " + (credsPath != null && new File(credsPath).exists()));

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("[Firebase] Initialized with Application Default Credentials.");
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("[Firebase] NOT initialized.");
        }
    }

    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }
}