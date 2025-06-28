package com.kma.shop.mapping;

import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.ReviewEntity;
import com.kma.shop.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapping {

    public ReviewEntity buildReviewBase(UserEntity user, ProductEntity product, int rating, String comment){
        return ReviewEntity.builder()
                .user(user)
                .product(product)
                .rating(rating)
                .comment(comment)
                .build();
    }
}
