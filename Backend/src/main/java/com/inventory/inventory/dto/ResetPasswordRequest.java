package com.inventory.inventory.dto;

public record ResetPasswordRequest(
        String oldPassword,
        String newPassword
) {
}