package com.kma.shop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    @OneToMany
    List<ImageEntity> images;
    @OneToMany(mappedBy = "event")
    List<EventProductEntity> eventProducts;
}
