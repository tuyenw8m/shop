package com.kma.shop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class EventProductEntity extends FormEntity{
    @ManyToOne
    ProductEntity product;
    @ManyToOne
    EventEntity event;
}
