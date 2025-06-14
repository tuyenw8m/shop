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
@Table(name = "productss")
public class ProductEntity extends FormEntity{
    private String name;
    private float price;
    private float original_price;
    private String features;
    private String description;
    private String technical_specs;
    private String highlight_specs;
    private String promotions;
    private int sold = 0;
    private int rating = 0;
    private int stock;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageEntity> imageV1;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImageEntity> images;
    @ManyToMany(mappedBy = "products", fetch = FetchType.EAGER)
    private List<CategoryEntity> categories;
    @ManyToMany(mappedBy = "products")
    private List<CartEntity> carts;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventProductEntity> eventProducts;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderEntity> orders;

    @ManyToOne
    private ParentCategoryEntity parentCategory;
    @ManyToMany(mappedBy = "products")
    private List<ChildCategoryEntity> childCategories;

    @ManyToOne
    private BranchEntity branch;
}
