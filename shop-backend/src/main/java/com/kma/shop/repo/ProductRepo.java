package com.kma.shop.repo;

import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<ProductEntity, String> {
    Optional<ProductEntity> findByName(String name);

    Page<ProductEntity> findByCategoriesAndPriceBetween
            (List<CategoryEntity> categories, float priceAfter, float priceBefore, Pageable pageable);
}
