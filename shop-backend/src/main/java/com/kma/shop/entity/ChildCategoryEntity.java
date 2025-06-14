package com.kma.shop.entity;

import jakarta.persistence.*;
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
@Table(name = "child_category")
public class ChildCategoryEntity extends FormEntity{
    @Column(columnDefinition = "TEXT", nullable = false)
    String description;
    String name;

    @ManyToOne(fetch = FetchType.LAZY)
    ParentCategoryEntity parent;

    @ManyToMany
    @JoinTable(
            name = "product_child_category",
            joinColumns = @JoinColumn(name = "child_category_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    List<ProductEntity> products;

    @ManyToMany(fetch = FetchType.EAGER)
    List<BranchEntity> branches;
}
