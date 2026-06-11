package com.inventory.inventory.rest.ItemController;

import com.inventory.inventory.dao.InventoryItemDao.InventoryItemDao;
import com.inventory.inventory.dao.ItemDao.ItemDao;
import com.inventory.inventory.vao.inventoryItem.Inventoryitem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventoryItem")
public class InventoryItemController {

    @Autowired
    private InventoryItemDao inventoryItemDao;

    @PostMapping("/addInventoryItem")
    public ResponseEntity<?> addInventoryItem(@RequestBody Inventoryitem inventoryItem){
        inventoryItemDao.save(inventoryItem);
        return ResponseEntity.ok("Inventory Item added successfully");
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllInventoryItems(){
        return ResponseEntity.ok(inventoryItemDao.findAll());
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
}
