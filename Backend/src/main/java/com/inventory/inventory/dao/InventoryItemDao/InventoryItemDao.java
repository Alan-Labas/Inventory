package com.inventory.inventory.dao.InventoryItemDao;

import com.inventory.inventory.vao.household.Household;
import com.inventory.inventory.vao.inventoryItem.Inventoryitem;
import com.inventory.inventory.vao.item.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InventoryItemDao extends JpaRepository<Inventoryitem, UUID> {
    Optional<Inventoryitem> findByItem(Item item);
    Optional<Inventoryitem> findByExpiryDate(Date expiryDate);
    // property path: inventoryItem.item.household
    List<Inventoryitem> findByItemHousehold(Household household);
    /*Optional<Inventoryitem> findByItemAddedAt(LocalDateTime addedAt );
    Optional<Inventoryitem> findByItemUpdatedAt(LocalDateTime updatedAt);*/
}
