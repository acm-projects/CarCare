package com.example.demo;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

@Service
public class FirestoreService {

    public Firestore db() {
        return FirestoreClient.getFirestore();
    }
}
