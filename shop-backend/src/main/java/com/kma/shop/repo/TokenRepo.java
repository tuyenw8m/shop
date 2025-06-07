package com.kma.shop.repo;

import com.kma.shop.entity.TokenEntity;
import com.kma.shop.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepo extends JpaRepository<TokenEntity, String> {
    boolean existsByToken(String token);
    void deleteByToken(String token);
    Optional<TokenEntity> findByToken(String token);
    @Query("DELETE FROM TokenEntity  t WHERE t.user = :user")
    @Modifying
    void deleteByUser(@Param("user") UserEntity user);
    Optional<TokenEntity> findByUser(UserEntity user);
    boolean existsByUser(UserEntity user);
}
