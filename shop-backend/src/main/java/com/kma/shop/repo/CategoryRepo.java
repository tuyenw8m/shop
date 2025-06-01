package com.kma.shop.repo;

import com.kma.shop.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<CategoryEntity, String> {
    CategoryEntity findByName(String name);
    void deleteByName(String name);
    boolean existsByName(String name);
}
