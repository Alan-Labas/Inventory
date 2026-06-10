package com.inventory.inventory.dao.UserDao;

import com.inventory.inventory.vao.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserDao extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    //List<User> findByIfAdmin();
    boolean existsByEmail(String email);
}
