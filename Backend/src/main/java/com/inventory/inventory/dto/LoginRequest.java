package com.inventory.inventory.dto;

public record LoginRequest(
        String email,
        String password
) {
}
