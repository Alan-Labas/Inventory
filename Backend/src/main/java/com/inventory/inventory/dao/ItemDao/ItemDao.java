package com.inventory.inventory.dao.ItemDao;

import com.inventory.inventory.vao.category.Category;
import com.inventory.inventory.vao.household.Household;
import com.inventory.inventory.vao.item.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ItemDao extends JpaRepository<Item, UUID> {
    Optional<Item> findByName(String name);
    Optional<Item> findByCategory(Category category);
    List<Item> findByHousehold(Household household);
}
