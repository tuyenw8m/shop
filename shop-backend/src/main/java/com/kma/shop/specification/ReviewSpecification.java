package com.kma.shop.specification;

import com.kma.shop.entity.ReviewEntity;
import org.springframework.data.jpa.domain.Specification;

public class ReviewSpecification {
    public static Specification<ReviewEntity> hasRating(int rating) {
        return (rating == 0) ? null : (root, query, cb) -> cb.equal(root.get("rating"), rating);
    }

    public static Specification<ReviewEntity> hasReviewer(String reviewer) {
        return (reviewer == null) ? null : (root, query, cb) -> cb.equal(root.get("reviewer"), reviewer);
    }

    public static Specification<ReviewEntity> hasProductId(String productId) {
        return(root, query, cb) -> cb.equal(root.get("product").get("id"), productId);
    }

    public static Specification<ReviewEntity> hasComment(String comment) {
        return (comment == null) ? null :
                (root, query, cb) -> cb.like(root.get("comment"),"%" + comment + "%");
    }
}
