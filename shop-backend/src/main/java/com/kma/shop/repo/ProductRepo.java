package com.kma.shop.repo;

import com.kma.shop.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<ProductEntity, String>, JpaSpecificationExecutor<ProductEntity> {
    Optional<ProductEntity> findByName(String name);

}
