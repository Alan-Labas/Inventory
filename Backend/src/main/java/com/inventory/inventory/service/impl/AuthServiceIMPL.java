package com.inventory.inventory.service.impl;

import com.inventory.inventory.dto.request.LoginRequest;
import com.inventory.inventory.dto.request.RegistrationRequest;
import com.inventory.inventory.dto.response.AuthResponse;
import com.inventory.inventory.dto.response.MessageResponse;
import com.inventory.inventory.entity.Household;
import com.inventory.inventory.entity.user.User;
import com.inventory.inventory.entity.user.UserRole;
import com.inventory.inventory.exception.InvalidCredentialsException;
import com.inventory.inventory.exception.UserAlreadyExistsException;
import com.inventory.inventory.exception.UserNotFoundException;
import com.inventory.inventory.repository.HouseholdRepository;
import com.inventory.inventory.repository.UserRepository;
import com.inventory.inventory.security.JwtService;
import com.inventory.inventory.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceIMPL implements AuthService {

    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public MessageResponse register(RegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email is already in use");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username is already taken");
        }

        Long householdId = request.getHouseholdId();
        if (householdId == null) {
            Household household = Household.builder()
                    .name(request.getName() + "'s Household")
                    .inviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .build();
            householdId = householdRepository.save(household).getHouseholdID();
        }

        User user = User.builder()
                .name(request.getName())
                .surname(request.getSurname())
                .email(request.getEmail())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .isActive(true)
                .householdId(householdId)
                .build();

        userRepository.save(user);
        return new MessageResponse("User registered successfully");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email/username or password");
        }

        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByUsername(request.getIdentifier()))
                .orElseThrow(() -> new UserNotFoundException("User not found: " + request.getIdentifier()));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .role(user.getRole())
                .build();
    }
}
