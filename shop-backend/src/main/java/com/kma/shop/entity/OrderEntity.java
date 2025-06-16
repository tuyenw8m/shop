package com.kma.shop.entity;

import com.kma.shop.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "oorder")
public class OrderEntity extends FormEntity{
    @ManyToOne
    @JoinColumn(name = "user_id")
    UserEntity user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    ProductEntity product;

    int quantity;
    String comment;
    Status status = Status.PENDING;
    float soldPrice;
    float primaryPrice;

}
