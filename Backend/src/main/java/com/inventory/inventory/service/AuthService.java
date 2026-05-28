package com.inventory.inventory.service;

import com.inventory.inventory.dto.request.LoginRequest;
import com.inventory.inventory.dto.request.RegistrationRequest;
import com.inventory.inventory.dto.response.AuthResponse;
import com.inventory.inventory.dto.response.MessageResponse;

public interface AuthService {
    MessageResponse register(RegistrationRequest request);
    AuthResponse login(LoginRequest request);
}
