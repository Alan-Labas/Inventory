package com.inventory.inventory.rest.ItemController;

import com.inventory.inventory.dao.InventoryItemDao.InventoryItemDao;
import com.inventory.inventory.dao.ItemDao.ItemDao;
import com.inventory.inventory.vao.inventoryItem.Inventoryitem;
import com.inventory.inventory.vao.item.Item;
import com.inventory.inventory.vao.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventoryItem")
public class InventoryItemController {

    @Autowired
    private InventoryItemDao inventoryItemDao;

    @Autowired
    private ItemDao itemDao;

    @PostMapping("/addInventoryItem")
    public ResponseEntity<?> addInventoryItem(@RequestBody Inventoryitem inventoryItem, @AuthenticationPrincipal User user){
        // only allow stocking items that belong to the caller's household
        Item item = inventoryItem.getItem() == null ? null
                : itemDao.findById(inventoryItem.getItem().getItemID()).orElse(null);
        if (item == null || item.getHousehold() == null || user.getHousehold() == null
                || !item.getHousehold().getHouseholdID().equals(user.getHousehold().getHouseholdID())) {
            return ResponseEntity.badRequest().body("Item not found in your household");
        }

        inventoryItem.setItem(item);
        inventoryItemDao.save(inventoryItem);
        return ResponseEntity.ok("Inventory Item added successfully");
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllInventoryItems(@AuthenticationPrincipal User user){
        if (user.getHousehold() == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(inventoryItemDao.findByItemHousehold(user.getHousehold()));
    }

    @GetMapping("/getbyItem")
    public ResponseEntity<?> getInventoryItemByItem(@RequestBody Inventoryitem inventoryItem){
        inventoryItem = inventoryItemDao.findByItem(inventoryItem.getItem()).orElse(null);

        if(inventoryItem == null){
            return ResponseEntity.badRequest().body("Inventory item not found");
        }

        return ResponseEntity.ok(inventoryItem);
    }

    @GetMapping("/getbyExpiryDate")
    public ResponseEntity<?> geInventoryByExpiryDate(@RequestBody Inventoryitem inventoryItem){
        inventoryItem = inventoryItemDao.findByExpiryDate(inventoryItem.getExpiryDate()).orElse(null);

        if(inventoryItem == null){
            return ResponseEntity.badRequest().body("Inventory item not found");
        }

        return ResponseEntity.ok(inventoryItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItemFromInventory(@AuthenticationPrincipal User user, @PathVariable UUID id){
        Inventoryitem inventoryItem = inventoryItemDao.findById(id).orElse(null);

        if(inventoryItem == null){
            return ResponseEntity.badRequest().body("Inventory item not found");
        }

        if (!inventoryItem.getItem().getHousehold().getHouseholdID().equals(user.getHousehold().getHouseholdID())) {
            return ResponseEntity.badRequest().body("You can only delete inventory items from your household");
        }

        inventoryItemDao.deleteById(id);
        return ResponseEntity.ok("Inventory item deleted successfully");
    }
}
