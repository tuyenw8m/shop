package com.kma.shop.specification;

import com.kma.shop.entity.EventEntity;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.enums.Status;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventSpecification {
    public static Specification<EventEntity> startAfter(LocalDate start) {
        return (start == null ? null : (root, query, criteriaBuilder)
                -> criteriaBuilder.greaterThan(root.get("startDate"), start) );
    }

    public static Specification<EventEntity> endBefore(LocalDate end) {
        return (end == null ? null : (root, query, criteriaBuilder)
                -> criteriaBuilder.lessThan(root.get("endDate"), end) );
    }
}
