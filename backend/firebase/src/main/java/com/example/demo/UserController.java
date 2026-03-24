package com.example.demo;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FirestoreService firestore;

    public UserController(FirestoreService firestore) {
        this.firestore = firestore;
    }


    @GetMapping("/me")
    public Map<String, Object> getMe(HttpServletRequest request) throws Exception {
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
        String uid = token.getUid();

        DocumentReference ref = firestore.db().collection("users").document(uid);
        DocumentSnapshot snap = ref.get().get();

        if (!snap.exists()) {
            Map<String, Object> profile = new HashMap<>();
            profile.put("uid", uid);
            profile.put("email", token.getEmail());
            profile.put("createdAt", Instant.now().toString());
            profile.put("updatedAt", Instant.now().toString());

            ref.set(profile).get();
            return profile;
        }

        return snap.getData();
    }


    @PatchMapping("/me")
    public Map<String, Object> updateMe(
            HttpServletRequest request,
            @RequestBody Map<String, Object> updates
    ) throws Exception {
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);
        String uid = token.getUid();

        Map<String, Object> allowed = new HashMap<>();

        if (updates.containsKey("displayName")) allowed.put("displayName", updates.get("displayName"));
        if (updates.containsKey("phone")) allowed.put("phone", updates.get("phone"));

        allowed.put("updatedAt", Instant.now().toString());

        firestore.db().collection("users").document(uid)
                .set(allowed, SetOptions.merge())
                .get();

        return Map.of("status", "ok");
    }
}
