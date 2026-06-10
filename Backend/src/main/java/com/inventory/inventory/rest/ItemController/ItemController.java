package com.inventory.inventory.rest.ItemController;

import com.inventory.inventory.dao.ItemDao.ItemDao;
import com.inventory.inventory.vao.item.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/item")
@CrossOrigin(origins = "http://localhost:3000")
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @PostMapping("/addItem")
    public ResponseEntity<?> addItem(@RequestBody Item item){
        item.setName(item.getName());
        item.setCategory(item.getCategory());
        item.setBarcode(item.getBarcode());
        item.setHousehold(item.getHousehold());
        item.setPet(item.getPet());

        itemDao.save(item);
        return ResponseEntity.ok("Item added successfully");

    }

    @GetMapping("/getItems")
    public ResponseEntity<?> getItems(){
        return ResponseEntity.ok(itemDao.findAll());
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
