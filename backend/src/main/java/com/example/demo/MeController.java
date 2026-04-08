package com.example.demo;

import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
public class MeController {

    // Must match whatever your auth filter sets on the request.
    // Using a local constant removes the compile dependency on FirebaseAuthFilter.
    private static final String ATTR_FIREBASE_TOKEN = "FIREBASE_TOKEN";

    @GetMapping("/api/me")
    public Map<String, Object> me(HttpServletRequest request) {
        Object attr = request.getAttribute(ATTR_FIREBASE_TOKEN);
        if (!(attr instanceof FirebaseToken token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Firebase token");
        }

        return Map.of(
                "uid", token.getUid(),
                "email", token.getEmail(),
                "claims", token.getClaims()
        );
    }
}