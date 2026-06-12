package com.inventory.inventory.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

// Sends transactional email through Brevo's HTTP API over HTTPS (port 443).
// We use the HTTP API instead of SMTP because many hosts (e.g. DigitalOcean)
// block outbound SMTP ports (25/465/587), while 443 is always open.
@Service("emailService")
public class EmailService {

    private final RestClient restClient = RestClient.create();

    @Value("${app.brevo.api-key:}")
    private String brevoApiKey;

    // Sender must be a verified sender in your Brevo account.
    @Value("${app.mail.from:}")
    private String fromEmail;

    @Value("${app.mail.from-name:Family Inventory}")
    private String fromName;

    @Async
    public void sendEmail(String to, String subject, String text) {
        Map<String, Object> body = Map.of(
                "sender", Map.of("name", fromName, "email", fromEmail),
                "to", List.of(Map.of("email", to)),
                "subject", subject,
                "textContent", text
        );

        restClient.post()
                .uri("https://api.brevo.com/v3/smtp/email")
                .header("api-key", brevoApiKey)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}
