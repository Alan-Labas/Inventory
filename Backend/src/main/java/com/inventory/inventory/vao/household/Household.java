package com.inventory.inventory.vao.household;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "houseHold")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Household {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "householdID")
    private UUID householdID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private String inviteCode;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }




}
