package com.inventory.inventory.dao.PetDao;

import com.inventory.inventory.vao.pet.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PetDao extends JpaRepository<Pet, UUID> {
    Optional<Pet> findByName(String name);
    /*Optional<Pet> findByHousehold(UUID household);
    Optional<Pet> findByPetSpecies(String species);
    Optional<Pet> findByPetbreed(String breed);*/
}
