package com.kma.shop.mapping;

import com.kma.shop.dto.request.OrderRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.enums.Status;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapping {
    public OrderResponse toOrderResponse(OrderEntity entity){
        if(entity == null) return null;
        return OrderResponse.builder()
                .id(entity.getId())
                .user_id(entity.getUser().getId())
                .product_id(entity.getProduct().getId())
                .items_count(entity.getQuantity())
                .created_at(entity.getCreationDate())
                .status(entity.getStatus())
                .total_price(entity.getQuantity() * entity.getProduct().getPrice())
                .build();
    }

    public List<OrderResponse> toOrderResponses(List<OrderEntity> entities){
        if(entities == null) return null;
        return entities.stream().map(this::toOrderResponse).collect(Collectors.toList());
    }

    public OrderEntity toOrderEntity(OrderRequest request, ProductEntity product, UserEntity user){
        if(request == null) return null;
        if(product == null) return null;
        if(user == null) return null;
        return OrderEntity.builder()
                .comment(request.getComment())
                .quantity(request.getQuantity())
                .product(product)
                .user(user)
                .status(Status.PENDING)
                .build();
    }
}
