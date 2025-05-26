package com.kma.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.List;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "cart_item")
public class CartItemEntity extends FormEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    private CartEntity cart;

    @ManyToOne(fetch = FetchType.LAZY)
    private ProductEntity product;

    private int quantity;
}

