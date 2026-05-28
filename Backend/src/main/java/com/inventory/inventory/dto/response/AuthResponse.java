package com.inventory.inventory.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.inventory.inventory.entity.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserRole role;
    private boolean requiresTwoFactor;
    private String tempToken;
}
