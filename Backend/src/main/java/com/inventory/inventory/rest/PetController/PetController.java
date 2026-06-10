package com.inventory.inventory.rest.PetController;

import com.inventory.inventory.dao.PetDao.PetDao;
import com.inventory.inventory.security.JwtTokenProvider;
import com.inventory.inventory.vao.pet.Pet;
import com.inventory.inventory.vao.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/pet")
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {

    @Autowired
    private PetDao petDao;

    @PostMapping("/addPet")
    public ResponseEntity<?> addPet(@RequestBody Pet pet){
        pet.setName(pet.getName());
        pet.setSpecies(pet.getSpecies());
        pet.setBreed(pet.getBreed());
        pet.setDailyConsumption(pet.getDailyConsumption());

        petDao.save(pet);
        return ResponseEntity.ok("Pet added successfully");
    }

    @GetMapping("/getPet")
    public ResponseEntity<?> getPet(){
        return ResponseEntity.ok(petDao.findAll());
    }

    @GetMapping("/getPetByName")
    public ResponseEntity<?> getPetById(@RequestBody Pet pet){
        pet = petDao.findByName(pet.getName()).orElse(null);

        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet not found");
        }
        return ResponseEntity.ok(pet);
    }
}
