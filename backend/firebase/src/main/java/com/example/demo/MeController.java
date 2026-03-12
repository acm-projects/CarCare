package com.example.demo;

import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    @GetMapping("/api/me")
    public Map<String, Object> me(HttpServletRequest request) {
        // This is the verified identity added by FirebaseAuthFilter
        FirebaseToken token = (FirebaseToken) request.getAttribute(FirebaseAuthFilter.ATTR_FIREBASE_TOKEN);

        return Map.of(
                "uid", token.getUid(),
                "email", token.getEmail(),
                "claims", token.getClaims()
        );
    }
}