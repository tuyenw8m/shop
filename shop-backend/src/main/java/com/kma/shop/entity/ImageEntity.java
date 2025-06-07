package com.kma.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "image")
public class ImageEntity extends FormEntity {
    String url;
    @ManyToOne(fetch = FetchType.LAZY)
    ProductEntity product;
    @ManyToOne(fetch = FetchType.LAZY)
    ReviewEntity review;
}
