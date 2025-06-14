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
@Table(name = "parent_category")
public class ParentCategoryEntity extends  FormEntity{
    @Column(columnDefinition = "TEXT", nullable = false)
    String description;
    String name;
    @OneToMany(mappedBy = "parentCategory", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    List<ProductEntity> products;
    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER, orphanRemoval = true, cascade = CascadeType.ALL)
    List<ChildCategoryEntity> childCategories;
}
