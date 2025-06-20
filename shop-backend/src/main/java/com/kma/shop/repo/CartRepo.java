package com.kma.shop.repo;

import com.kma.shop.entity.CartEntity;
import com.kma.shop.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<CartEntity, String> {
    CartEntity findByUser(UserEntity user);
    @Query("SELECT c FROM CartEntity c WHERE c.user.id = :userId")
    CartEntity findByUserId(@Param("userId") String userId);
}
