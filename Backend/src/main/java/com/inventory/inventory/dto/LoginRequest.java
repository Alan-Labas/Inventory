package com.inventory.inventory.dto;

public record LoginRequest(
        String identifier,
        String password
) {
}
