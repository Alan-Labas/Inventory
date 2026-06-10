package com.inventory.inventory.dao.Category;

import com.inventory.inventory.vao.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoryDao extends JpaRepository<Category, UUID> {
    Optional<Category> findByName(String name);
}
