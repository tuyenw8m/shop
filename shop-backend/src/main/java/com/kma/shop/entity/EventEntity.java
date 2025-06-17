package com.kma.shop.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class EventEntity extends FormEntity{
    String title;
    String content;
    LocalDate startDate;
    LocalDate endDate;
    float promotionPercent;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    List<EventImageEntity> images;
    @OneToMany(mappedBy = "event")
    List<ProductEntity> eventProducts;
}
