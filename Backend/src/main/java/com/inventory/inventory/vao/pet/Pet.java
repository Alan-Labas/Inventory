package com.inventory.inventory.vao.pet;

import com.inventory.inventory.vao.household.Household;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "pet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "petID")
    private UUID petID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String species;

    @Column(nullable = false)
    private String breed;

    @Column(nullable = false)
    private String dailyConsumption;

    @ManyToOne
    @JoinColumn(name = "household_id")
    private Household household;
}
