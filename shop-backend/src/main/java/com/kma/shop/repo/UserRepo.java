package com.kma.shop.repo;


import com.kma.shop.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, String> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByName(String name);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByPhone(String phone);
    Optional<Page<UserEntity>> findByNameContaining(String name, Pageable pageable);

}
