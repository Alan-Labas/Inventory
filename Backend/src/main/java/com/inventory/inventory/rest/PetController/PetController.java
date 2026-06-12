package com.inventory.inventory.rest.PetController;

import com.inventory.inventory.dao.PetDao.PetDao;
import com.inventory.inventory.security.JwtTokenProvider;
import com.inventory.inventory.vao.item.Item;
import com.inventory.inventory.vao.pet.Pet;
import com.inventory.inventory.vao.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/api/pet")
public class PetController {

    @Autowired
    private PetDao petDao;

    @PostMapping("/addPet")
    public ResponseEntity<?> addPet(@RequestBody Pet pet, @AuthenticationPrincipal User user){
        if (user.getHousehold() == null) {
            return ResponseEntity.badRequest().body("Join or create a household first");
        }



        pet.setName(pet.getName());
        pet.setSpecies(pet.getSpecies());
        pet.setBreed(pet.getBreed());
        pet.setDailyConsumption(pet.getDailyConsumption());
        pet.setHousehold(user.getHousehold());

        petDao.save(pet);
        return ResponseEntity.ok("Pet added successfully");
    }

    @GetMapping("/getPet")
    public ResponseEntity<?> getPet(@AuthenticationPrincipal User user){
        if (user.getHousehold() == null){
            return ResponseEntity.ok(java.util.List.of());
        }
        return ResponseEntity.ok(petDao.findByHousehold(user.getHousehold()));
    }

    @GetMapping("/getPetByName")
    public ResponseEntity<?> getPetById(@RequestBody Pet pet, @AuthenticationPrincipal User user){

        pet = petDao.findByName(pet.getName()).orElse(null);

        if(!pet.getHousehold().getHouseholdID().equals(user.getHousehold().getHouseholdID())){
            return ResponseEntity.badRequest().body("you only get pets from your household");
        }


        return ResponseEntity.ok(pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable UUID id, @AuthenticationPrincipal User user){
        Pet pet = petDao.findById(id).orElse(null);

        if(pet == null){
            return ResponseEntity.badRequest().body("Pet not found");
        }

        if(!pet.getHousehold().getHouseholdID().equals(user.getHousehold().getHouseholdID())){
            return ResponseEntity.badRequest().body("You can only delete pets from your household :)");
        }
        petDao.deleteById(id);

        return ResponseEntity.ok("Pet deleted successfully");
    }

}
