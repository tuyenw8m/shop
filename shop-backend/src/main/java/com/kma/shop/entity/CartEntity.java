package com.kma.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "cart")
public class CartEntity extends FormEntity {
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItemEntity> items = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ProductEntity> products;
}
