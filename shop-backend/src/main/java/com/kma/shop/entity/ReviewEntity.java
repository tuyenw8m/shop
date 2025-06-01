package com.kma.shop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class ReviewEntity extends  FormEntity {
    private int rating;
    private String comment;
    @ManyToOne(fetch = FetchType.LAZY)
    UserEntity user;
    @ManyToOne(fetch = FetchType.LAZY)
    ProductEntity product;
    @OneToMany
    List<ImageEntity> images;
}
