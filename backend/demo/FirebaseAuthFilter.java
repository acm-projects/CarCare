package com.example.demo;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {


    public static final String ATTR_FIREBASE_TOKEN = "firebaseToken";


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Public endpoints you want accessible without auth:
        return path.equals("/start")
                || path.endsWith("/ping");
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);


        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing/invalid Authorization header. Use: Authorization: Bearer <Firebase ID token>");
            return;
        }

        String idToken = authHeader.substring("Bearer ".length()).trim();

        try {

            FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);


            request.setAttribute(ATTR_FIREBASE_TOKEN, decoded);


            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token verification failed: " + e.getMessage());
        }
    }
}
