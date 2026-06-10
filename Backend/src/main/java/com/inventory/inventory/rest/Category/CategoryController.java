package com.inventory.inventory.rest.Category;

import com.inventory.inventory.dao.Category.CategoryDao;
import com.inventory.inventory.vao.category.Category;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryDao categoryDao;

    @PostMapping("/addCategory")
    public ResponseEntity<?> addCategory(@RequestBody Category category){
        category.setName(category.getName());
        category.setIcon(category.getIcon());
        category.setHousehold(category.getHousehold());

        categoryDao.save(category);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/getByName")
    public ResponseEntity<?> getCategoryByName(@RequestBody Category category){
        category = categoryDao.findByName(category.getName()).orElse(null);

        if(category == null){
            return ResponseEntity.badRequest().body("Category not found");
        }
        return ResponseEntity.ok(category);
    }


}
