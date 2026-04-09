package com.example.demo;

import org.springframework.stereotype.Service;

import com.google.cloud.firestore.Firestore;

@Service
public class FirestoreService {

    private final Firestore firestore;

    public FirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Firestore db() {
        return firestore;
    }
}