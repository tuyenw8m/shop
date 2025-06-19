package com.kma.shop.repo;

import com.kma.shop.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepo extends JpaRepository<CartItemEntity, String> {
    @Query("DELETE FROM CartItemEntity c WHERE c.cart.id = :cartId AND c.product.id = :productId")
    void deleteByItemIdAndCartId(@Param("productId")String productId, @Param("cartId")String cartId);
}
