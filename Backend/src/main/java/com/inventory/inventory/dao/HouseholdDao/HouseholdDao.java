package com.inventory.inventory.dao.HouseholdDao;

import com.inventory.inventory.vao.household.Household;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HouseholdDao extends JpaRepository<Household, UUID> {
    Optional<Household> findByName(String name);
    Optional<Household> findByInviteCode(String inviteCode);
}
