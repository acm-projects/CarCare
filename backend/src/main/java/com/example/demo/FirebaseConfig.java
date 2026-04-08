package com.example.demo;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        // If Firebase is already initialized, do nothing.
        if (!FirebaseApp.getApps().isEmpty()) return;

        try {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("[Firebase] Initialized with Application Default Credentials.");
        } catch (IOException e) {
            // Dev-friendly: allow the server to start without Firebase creds.
            // Any route that relies on Firebase Admin will fail until creds are provided.
            System.out.println("[Firebase] NOT initialized (no ADC). Server will still start.");
            System.out.println("[Firebase] To enable Firebase locally, set GOOGLE_APPLICATION_CREDENTIALS.");
        }
    }
}