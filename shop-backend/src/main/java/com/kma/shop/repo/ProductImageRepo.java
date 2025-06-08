package com.kma.shop.repo;

import com.kma.shop.entity.ProductImageEntity;
import com.kma.shop.entity.ReviewImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepo extends JpaRepository<ProductImageEntity, String> {
}
