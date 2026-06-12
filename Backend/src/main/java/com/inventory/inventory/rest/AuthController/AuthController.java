package com.inventory.inventory.rest.AuthController;

import com.inventory.inventory.dao.UserDao.UserDao;
import com.inventory.inventory.dao.token.ConfirmationTokenDao;
import com.inventory.inventory.dto.LoginRequest;
import com.inventory.inventory.dto.RegisterRequest;
import com.inventory.inventory.security.JwtTokenProvider;
import com.inventory.inventory.service.EmailService;
import com.inventory.inventory.vao.token.ConfirmationToken;
import com.inventory.inventory.vao.user.User;
import com.inventory.inventory.vao.user.User_role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
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

    @Autowired
    private ConfirmationTokenDao confirmationTokenDao;
    @Autowired
    private EmailService emailService;

    // Base URL of the frontend; used to build the email confirmation link.
    @Value("${app.frontend-url}")
    private String frontendUrl;

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
        // stays inactive until the email link is clicked
        user.setActive(false);

        userDao.save(user);

        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationTokenDao.save(confirmationToken);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Complete Registration");
        message.setText("To confirm your registration please click on the link: "
                + frontendUrl + "/confirm-email?token=" + confirmationToken.getConfirmationToken());
        emailService.sendEmail(message);

        return ResponseEntity.ok("Verify email by the link sent to your email address");

    }

    @RequestMapping(value="/confirm-acc", method= {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> confirmEmail(@RequestParam("token") String confirmationToken){
        ConfirmationToken token = confirmationTokenDao.findByConfirmationToken(confirmationToken);
        if (token == null) {
            return ResponseEntity.badRequest().body("Invalid confirmation link");
        }

        User user = token.getUser();
        user.setActive(true);
        userDao.save(user);

        // single use: a confirmed token is removed
        confirmationTokenDao.delete(token);

        return ResponseEntity.ok("Email confirmed! You can now log in.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        User user = userDao.findByEmail(request.identifier())
                .or(() -> userDao.findByUsername(request.identifier()))
                .orElse(null);
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())){
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        if (!user.isActive()) {
            return ResponseEntity.badRequest().body("Please confirm your email first");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("name", user.getName());

        return ResponseEntity.ok(response);

    }

}
