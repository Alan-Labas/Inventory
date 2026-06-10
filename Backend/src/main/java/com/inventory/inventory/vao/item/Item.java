package com.inventory.inventory.vao.item;


import com.inventory.inventory.vao.category.Category;
import com.inventory.inventory.vao.household.Household;
import com.inventory.inventory.vao.pet.Pet;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @Column(name = "itemID")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID itemID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String barcode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;
}
