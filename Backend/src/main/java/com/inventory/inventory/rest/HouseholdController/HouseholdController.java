package com.inventory.inventory.rest.HouseholdController;

import com.inventory.inventory.dao.HouseholdDao.HouseholdDao;
import com.inventory.inventory.vao.household.Household;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/household")
@CrossOrigin(origins = "http://localhost:3000")
public class HouseholdController {
    @Autowired
    private HouseholdDao householdDao;

    @PostMapping("/addHousehold")
    public ResponseEntity<?> addHousehold(@RequestBody Household household){
        household.setName(household.getName());
        household.setInviteCode(household.getInviteCode());
        household.setCreatedAt(household.getCreatedAt());
        householdDao.save(household);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/getByName")
    public ResponseEntity<?> getHouseholdByName(@RequestBody Household household){
        household = householdDao.findByName(household.getName()).orElse(null);

        if (household == null) {
            return ResponseEntity.badRequest().body("Household not found");
        }

        return ResponseEntity.ok(household);
    }

    @GetMapping("/getByInviteCode")
    public ResponseEntity<?> getHouseholdByInviteCode(@RequestBody Household household){
        household = householdDao.findByInviteCode(household.getInviteCode()).orElse(null);

        if (household == null) {
            return ResponseEntity.badRequest().body("Household not found");
        }

        return ResponseEntity.ok(household);
    }
}
