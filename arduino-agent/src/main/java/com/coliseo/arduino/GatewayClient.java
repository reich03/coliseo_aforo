package com.coliseo.arduino;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Envía lecturas al API Gateway mediante HTTP POST.
 */
public class GatewayClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String gatewayBaseUrl;

    public GatewayClient(String gatewayBaseUrl) {
        this.gatewayBaseUrl = gatewayBaseUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public void post(String path, LecturaRequestDto dto) {
        try {
            String json = objectMapper.writeValueAsString(dto);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(gatewayBaseUrl + path))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .timeout(Duration.ofSeconds(10))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString());

            System.out.println("[Gateway] " + response.statusCode() + " → " + response.body());

        } catch (Exception e) {
            System.err.println("[Gateway] Error enviando lectura: " + e.getMessage());
        }
    }
}
