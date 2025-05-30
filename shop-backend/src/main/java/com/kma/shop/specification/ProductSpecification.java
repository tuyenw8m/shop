package com.kma.shop.specification;

import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ImageEntity;
import com.kma.shop.entity.ProductEntity;
import jakarta.persistence.OneToMany;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ProductSpecification {
    public static Specification<ProductEntity> hasName(String name){
        return (name == null || name.isBlank()) ? null : (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<ProductEntity> hasPriceBetween(float min, float max){
        return (root, query, cb) ->
                cb.between(root.get("price"), min, max);
    }

    public static Specification<ProductEntity> hasCategory(CategoryEntity category){
        return (root, query, cb) ->
                cb.equal(root.get("category"), category);
    }
}
