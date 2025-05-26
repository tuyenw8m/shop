package com.kma.shop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.websocket.OnError;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "productss")
public class ProductEntity extends FormEntity{
    private String name;
    private float price;
    private String description;
    private String technical_specs;
    private String highlight_specs;
    private int stock;
    @OneToMany(mappedBy = "product")
    private List<ImageEntity> image;
    @OneToMany(mappedBy = "product")
    private List<CategoryEntity> categories;
    @ManyToMany(mappedBy = "products")
    private List<CartEntity> products;
}
