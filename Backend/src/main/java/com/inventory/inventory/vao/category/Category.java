package com.inventory.inventory.vao.category;

import com.inventory.inventory.vao.household.Household;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categoryID")
    private Long categoryID;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String icon;

    @ManyToOne
    @JoinColumn(name = "household_id")
    private Household household;

}
