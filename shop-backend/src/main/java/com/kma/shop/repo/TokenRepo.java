package com.kma.shop.repo;

import com.kma.shop.entity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepo extends JpaRepository<TokenEntity, String> {
    boolean existsByToken(String token);
    void deleteByToken(String token);
    Optional<TokenEntity> findByToken(String token);
}
