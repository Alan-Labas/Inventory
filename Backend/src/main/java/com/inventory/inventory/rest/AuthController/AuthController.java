package com.inventory.inventory.rest.AuthController;

import com.inventory.inventory.dao.UserDao.UserDao;
import com.inventory.inventory.dto.LoginRequest;
import com.inventory.inventory.dto.RegisterRequest;
import com.inventory.inventory.security.JwtTokenProvider;
import com.inventory.inventory.vao.user.User;
import com.inventory.inventory.vao.user.User_role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userDao.existsByEmail(request.email())){
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(request.name());
        user.setSurname(request.surname());
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(User_role.USER);
        user.setActive(true);

        userDao.save(user);
        return ResponseEntity.ok("User registered successfully");

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        User user = userDao.findByEmail(request.email()).orElse(null);
        if (user == null ){
            return ResponseEntity.badRequest().body("User not found");
        }

        if(!passwordEncoder.matches(request.password(), user.getPasswordHash())){
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("name", user.getName());

        return ResponseEntity.ok(response);

    }

}
