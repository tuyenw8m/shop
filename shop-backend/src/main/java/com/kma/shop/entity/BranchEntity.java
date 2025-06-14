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
@Table(name = "branch")
public class BranchEntity extends  FormEntity{
    String name;
    String description;

    @ManyToMany
    List<ChildCategoryEntity> categories;
    @OneToMany(mappedBy = "branch")
    List<ProductEntity> product;
}
