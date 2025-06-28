package com.kma.shop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
    private float promotionPercent = 0;
    @Column(columnDefinition = "TEXT")
    @Lob
    private String features;
    @Column(columnDefinition = "TEXT")
    @Lob
    private String description;
    @Column(columnDefinition = "TEXT")
    @Lob
    private String technical_specs;
    @Column(columnDefinition = "TEXT")
    @Lob
    private String highlight_specs;
    @Column(columnDefinition = "TEXT")
    private String promotions;
    private LocalDate endEvent = LocalDate.now().minusDays(1);
    private LocalDate startEvent = LocalDate.now().minusDays(1);
    private int sold = 0;
    private int rating = 0;
    private int stock;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageEntity> imageV1;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImageEntity> images;
    @ManyToMany(mappedBy = "products", fetch = FetchType.EAGER)
    private List<CategoryEntity> categories;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<CartItemEntity> items;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderEntity> orders;

    @ManyToOne
    private ParentCategoryEntity parentCategory;
    @ManyToMany(mappedBy = "products")
    private List<ChildCategoryEntity> childCategories;

    @ManyToOne
    private BranchEntity branch;

    @ManyToOne
    private EventEntity event;
}
