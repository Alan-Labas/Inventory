package com.inventory.inventory.rest.UserController;

import com.inventory.inventory.dao.UserDao.UserDao;
import com.inventory.inventory.dto.ResetPasswordRequest;
import com.inventory.inventory.vao.user.User;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ResetPasswordRequest request, @AuthenticationPrincipal User user){
        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userDao.save(user);
        return ResponseEntity.ok("Password reset successfully");
    }



}
