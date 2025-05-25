package com.kma.shop.repo;

import com.kma.shop.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepo extends JpaRepository<RoleEntity, String> {
    boolean existsByRoleName(String name);
    Optional<RoleEntity> findByRoleName(String s);
}
