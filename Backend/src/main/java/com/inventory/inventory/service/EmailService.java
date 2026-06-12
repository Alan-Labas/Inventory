package com.inventory.inventory.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service("emailService")
public class EmailService {

    private final JavaMailSender javaMailSender;

    // SMTP relays (Brevo) reject mail without a verified sender address
    @Value("${spring.mail.from:}")
    private String from;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendEmail(SimpleMailMessage email) {
        if (!from.isBlank()) {
            email.setFrom(from);
        }
        javaMailSender.send(email);
    }

}
