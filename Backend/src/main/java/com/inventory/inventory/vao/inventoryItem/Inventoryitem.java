package com.inventory.inventory.vao.inventoryItem;

import com.inventory.inventory.vao.item.Item;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "inventoryItem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventoryitem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "inventoryItemID")
    private UUID inventoryItemID;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Date expiryDate;

    @Column(nullable = false)
    private LocalDateTime addedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    /*@ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;*/

    /*@ManyToOne
    @JoinColumn(name = "unit_id")
    private Unit unit;*/
}
