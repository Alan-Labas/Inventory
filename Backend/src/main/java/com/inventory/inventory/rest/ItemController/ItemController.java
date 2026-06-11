package com.inventory.inventory.rest.ItemController;

import com.inventory.inventory.dao.ItemDao.ItemDao;
import com.inventory.inventory.vao.item.Item;
import com.inventory.inventory.vao.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/item")
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @PostMapping("/addItem")
    public ResponseEntity<?> addItem(@RequestBody Item item, @AuthenticationPrincipal User user){
        if (user.getHousehold() == null) {
            return ResponseEntity.badRequest().body("Join or create a household first");
        }
        // the household always comes from the logged-in user, never from the client
        item.setHousehold(user.getHousehold());

        itemDao.save(item);
        return ResponseEntity.ok("Item added successfully");

    }

    @GetMapping("/getItems")
    public ResponseEntity<?> getItems(@AuthenticationPrincipal User user){
        if (user.getHousehold() == null) {
            return ResponseEntity.ok(java.util.List.of());
        }
        return ResponseEntity.ok(itemDao.findByHousehold(user.getHousehold()));
    }

    @GetMapping("/getByName")
    public ResponseEntity<?> getItemByName(@RequestBody Item item){
        item = itemDao.findByName(item.getName()).orElse(null);

        if (item == null) {
            return ResponseEntity.badRequest().body("Item not found");
        }

        return ResponseEntity.ok(item);
    }

    @GetMapping("/getByCategory")
    public ResponseEntity<?> getItemByCategory(@RequestBody Item item){
        item = itemDao.findByCategory(item.getCategory()).orElse(null);

        if (item == null){
            return ResponseEntity.badRequest().body("Item not found");
        }

        return ResponseEntity.ok(item);
    }

}
