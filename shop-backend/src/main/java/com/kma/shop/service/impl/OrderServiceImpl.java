package com.kma.shop.service.impl;

import com.kma.shop.dto.request.OrderRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.enums.Status;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.OrderMapping;
import com.kma.shop.repo.OrderRepo;
import com.kma.shop.service.interfaces.OrderService;
import com.kma.shop.service.interfaces.ProductService;
import com.kma.shop.service.interfaces.UserService;
import com.kma.shop.specification.OrderSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepo orderRepo;
    UserService userService;
    ProductService productService;
    OrderMapping orderMapping;

    @Override
    public boolean isOrderedProduct(String productId){
        UserEntity user = userService.getCurrentUser();
        return user.getOrders().stream()
                .anyMatch(order -> order.getProduct().getId().equals(productId));
    }

    @Override
    public boolean isOrdered(String id){
        return orderRepo.existsById(id);
    }

    @Override
    public OrderResponse update(String orderId, String state) throws AppException {
        Status status = Status.valueOf(state);
        OrderEntity orderEntity = orderRepo.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));
        orderEntity.setStatus(status);
        return orderMapping.toOrderResponse(orderRepo.save(orderEntity));
    }



    @Override
    public PageResponse<OrderResponse> getMyOrders(String status, String search, int page, int limit)   {
        if(page < 0) page = 1;
        if(limit < 1) limit = 10;
        Pageable pageable = PageRequest.of(page, limit);

        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Specification<OrderEntity> specification = Specification
                .where(OrderSpecification.hasStatus(status == null ? null : Status.valueOf(status)))
                .and(OrderSpecification.hasUserId(userId));
        Page<OrderEntity> result = orderRepo.findAll(specification, pageable);

        return PageResponse.<OrderResponse>builder()
                .content(orderMapping.toOrderResponses(result.getContent()))
                .pageNumber(result.getNumber() + 1)
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Override
    public OrderResponse create(OrderRequest request) throws AppException {
        if(Objects.isNull(request) || request.getQuantity() <= 0) throw new AppException(ErrorCode.INVALID_INPUT);
        if(request.getProduct_id() == null || request.getProduct_id().isEmpty()) throw new AppException(ErrorCode.INVALID_INPUT);
        if(request.getStatus() != null && !request.getStatus().equals("PENDING")) throw new AppException(ErrorCode.INVALID_INPUT);

        ProductEntity product = productService.findById(request.getProduct_id());
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);

        OrderEntity order = orderMapping.toOrderEntity(request, product, user);
        return orderMapping.toOrderResponse(orderRepo.save(order));
    }

    @Override
    public List<OrderResponse> getOrderResponses(List<String> ids) {
        if (ids == null || ids.isEmpty()) return Collections.emptyList();
        return ids.stream()
                .map(this::safeGetOrderResponse)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse safeGetOrderResponse(String id) {
        try {
            return getOrderResponse(id);
        } catch (AppException e) {
            return null;
        }
    }

    @Override
    public OrderResponse getOrderResponse(String id) throws AppException {
        if (id == null || id.trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT); // Có thể tạo lỗi mới cho ID null
        }
        return orderMapping.toOrderResponse(
                orderRepo.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND))
        );
    }

    @Override
    public void delete(String id) throws AppException {
        if(id == null || id.trim().isEmpty()) throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        orderRepo.deleteById(id);
    }
}
