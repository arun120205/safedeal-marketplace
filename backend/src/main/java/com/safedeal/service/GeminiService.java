package com.safedeal.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    // ---------- TEXT CALL ----------
    public String generateText(String prompt) {
        try {
            JSONObject body = new JSONObject()
                    .put("contents", new JSONArray().put(
                            new JSONObject().put("parts", new JSONArray().put(
                                    new JSONObject().put("text", prompt)))));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                            + model + ":generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .build();

            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            return extractText(new JSONObject(response.body()));
        } catch (RuntimeException e) {
            throw e;   // pass our honest errors up!
        } catch (Exception e) {
            throw new RuntimeException("Gemini API failed: " + e.getMessage());
        }
    }

    // ---------- VISION CALL (image URL → analysis) ----------
    public String analyzeImage(String imageUrl, String question) {
        try {
            // download image + read its REAL content type (png/jpeg/webp...)
            HttpResponse<byte[]> imgResp = http.send(
                    HttpRequest.newBuilder().uri(URI.create(imageUrl)).GET().build(),
                    HttpResponse.BodyHandlers.ofByteArray());

            String mimeType = imgResp.headers().firstValue("Content-Type")
                    .filter(ct -> ct.startsWith("image/"))
                    .orElse("image/jpeg");                       // ✅ real type, not hardcoded!
            String base64 = Base64.getEncoder().encodeToString(imgResp.body());

            JSONObject body = new JSONObject()
                    .put("contents", new JSONArray().put(new JSONObject().put("parts",
                            new JSONArray()
                                    .put(new JSONObject().put("text", question))
                                    .put(new JSONObject().put("inline_data", new JSONObject()
                                            .put("mime_type", mimeType)   // ✅ fixed!
                                            .put("data", base64))))));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                            + model + ":generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                    .build();

            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            return extractText(new JSONObject(response.body()));
        } catch (RuntimeException e) {
            System.out.println("⚠️ IMAGE ANALYSIS SKIPPED: " + e.getMessage());
            return "IMAGE_ANALYSIS_UNAVAILABLE";   // graceful — listing still works
        } catch (Exception e) {
            System.out.println("⚠️ IMAGE ANALYSIS SKIPPED: " + e.getMessage());
            return "IMAGE_ANALYSIS_UNAVAILABLE";
        }
    }

    // ---------- honest error extraction ----------
    private String extractText(JSONObject json) {
        if (!json.has("candidates")) {
            // Gemini sent an ERROR — show the REAL reason!
            String realReason = json.optJSONObject("error") != null
                    ? json.getJSONObject("error").optString("message")
                    : json.toString();
            throw new RuntimeException("Gemini error: " + realReason);
        }
        return json.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text");
    }
}