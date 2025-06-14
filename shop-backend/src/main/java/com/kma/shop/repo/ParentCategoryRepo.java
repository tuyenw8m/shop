package com.kma.shop.repo;

import com.kma.shop.entity.ParentCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParentCategoryRepo  extends JpaRepository<ParentCategoryEntity, String> {
    List<ParentCategoryEntity> findAll();
    Optional<ParentCategoryEntity> findByName(String name);
    boolean existsByName(String name);
}
