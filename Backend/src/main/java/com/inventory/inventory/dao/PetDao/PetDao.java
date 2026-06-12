package com.inventory.inventory.dao.PetDao;

import com.inventory.inventory.vao.household.Household;
import com.inventory.inventory.vao.pet.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PetDao extends JpaRepository<Pet, UUID> {
    Optional<Pet> findByName(String name);
    List<Pet> findByHousehold(Household household);
    /*Optional<Pet> findByPetSpecies(String species);
    Optional<Pet> findByPetbreed(String breed);*/
}
