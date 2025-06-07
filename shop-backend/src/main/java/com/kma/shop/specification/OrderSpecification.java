package com.kma.shop.specification;

import com.kma.shop.entity.OrderEntity;
import com.kma.shop.enums.Status;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {
    public static Specification<OrderEntity> hasStatus(Status status) {
        return (status == null ) ? null : (root, query, cb) ->
                cb.equal(cb.lower(root.get("status")), status);
    }

    public static Specification<OrderEntity> hasUserId(String userId) {
        return (userId == null || userId.isBlank() ? null : (root, query, cb)
                -> cb.equal(cb.lower(root.get("user").get("id")), userId));
    }

    public static Specification<OrderEntity> hasProductId(String productId) {
        return (productId == null || productId.isBlank() ? null : (root, query, cb)
                -> cb.equal(cb.lower(root.get("product").get("id")), productId));
    }
}
