package com.kma.shop.repo;

import com.kma.shop.entity.ChildCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChildCategoryRepo extends JpaRepository<ChildCategoryEntity, String> {
    Optional<ChildCategoryEntity> findByName(String name);
    boolean existsByName(String name);
}
