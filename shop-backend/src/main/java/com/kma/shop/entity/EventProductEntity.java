package com.kma.shop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class EventProductEntity extends FormEntity{
    LocalDate startDate;
    LocalDate endDate;
    @ManyToOne
    ProductEntity product;
    @ManyToOne
    EventEntity event;
}
