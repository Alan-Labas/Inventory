package com.inventory.inventory.rest.HouseholdController;

import com.inventory.inventory.dao.HouseholdDao.HouseholdDao;
import com.inventory.inventory.dao.UserDao.UserDao;
import com.inventory.inventory.vao.household.Household;
import com.inventory.inventory.vao.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/household")
public class HouseholdController {
    @Autowired
    private HouseholdDao householdDao;

    @Autowired
    private UserDao userDao;

    // The logged-in user's household (or 200 with empty body when they have none yet).
    @GetMapping("/my")
    public ResponseEntity<?> myHousehold(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user.getHousehold());
    }

    @PostMapping("/addHousehold")
    public ResponseEntity<?> addHousehold(@RequestBody Household household, @AuthenticationPrincipal User user) {
        if (user.getHousehold() != null) {
            return ResponseEntity.badRequest().body("You already belong to a household");
        }
        if (household.getInviteCode() == null || household.getInviteCode().isBlank()) {
            household.setInviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        householdDao.save(household);

        // the creator becomes a member of the new household
        user.setHousehold(household);
        userDao.save(user);

        return ResponseEntity.ok(household);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinHousehold(@RequestBody Household request, @AuthenticationPrincipal User user) {
        Household household = householdDao.findByInviteCode(request.getInviteCode()).orElse(null);
        if (household == null) {
            return ResponseEntity.badRequest().body("Invalid invite code");
        }

        user.setHousehold(household);
        userDao.save(user);
        return ResponseEntity.ok(household);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> leaveFromHousehold(@PathVariable UUID id, @AuthenticationPrincipal User user){
        Household household = householdDao.findById(id).orElse(null);

        if (household == null) {
            return ResponseEntity.badRequest().body("Household not found");
        }

        if(!household.getHouseholdID().equals(user.getHousehold().getHouseholdID())){
            return ResponseEntity.badRequest().body("You are not a member of this household");
        }

        user.setHousehold(null);
        userDao.save(user);

        return ResponseEntity.ok("You have left the household");

    }
}
