package com.kma.shop.specification;

import com.kma.shop.entity.OrderNumberEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.enums.Status;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {
    public static Specification<OrderNumberEntity> hasStatus(Status status) {
        return (status == null ) ? null : (root, query, cb) ->
                cb.equal(cb.lower(root.get("status")), status);
    }

    public static Specification<OrderNumberEntity> hasUserId(String userId) {
        return (userId == null || userId.isBlank() ? null : (root, query, cb)
                -> cb.equal(cb.lower(root.get("orderProduct").get("user").get("id")), userId));
    }

    public static Specification<OrderNumberEntity> hasProductId(String productId) {
        return (productId == null || productId.isBlank() ? null : (root, query, cb)
                -> cb.equal(cb.lower(root.get("product").get("id")), productId));
    }


}
