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
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepo orderRepo;
    UserService userService;
    ProductService productService;
    OrderMapping orderMapping;

    public OrderServiceImpl(OrderRepo orderRepo, UserService userService,
                            @Qualifier("productServiceImpl") ProductService productService, OrderMapping orderMapping) {
        this.orderRepo = orderRepo;
        this.userService = userService;
        this.productService = productService;
        this.orderMapping = orderMapping;
    }


    @Override
    public long count(){
        return orderRepo.count();
    }

    @PreAuthorize("hasRole('USER')")
    @Override
    public float countTotalPrice(){
        UserEntity user = userService.getCurrentUser();
        float total_price = 0;
        for(OrderEntity orderEntity : user.getOrders()){
            total_price += orderEntity.getQuantity() * orderEntity.getProduct().getPrice();
        }
        return total_price;
    }

    @Override
    public boolean isOrderedProductByProductId(String productId){
        UserEntity user = userService.getCurrentUser();
        return user.getOrders().stream()
                .anyMatch(order -> order.getProduct().getId().equals(productId));
    }

    @Override
    public boolean existById(String id){
        return orderRepo.existsById(id);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
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
    public OrderResponse userUpdateQuantityeOrder(String orderId, int quantity) throws AppException {
        if(quantity <= 0) throw new AppException(ErrorCode.INVALID_INPUT);
        if(orderId == null | orderId.trim().isEmpty()) throw new AppException(ErrorCode.INVALID_INPUT);

        OrderEntity orderEntity = orderRepo.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));

        // Giả định bạn có CustomUserPrincipal
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!userId.equals(orderEntity.getUser().getId())) {
            throw new AppException(ErrorCode.NOT_AUTHORIZATION);
        }

        // Optional: check current status logic
        if (orderEntity.getStatus() == Status.SHIPPED || orderEntity.getStatus() == Status.DELIVERED) {
            throw new AppException(ErrorCode.ORDER_ALREADY_PROCESSED);
        }

        orderEntity.setQuantity(quantity);
        OrderEntity updated = orderRepo.save(orderEntity);

        return orderMapping.toOrderResponse(updated);
    }

    @Override
    public OrderResponse userUpdateStateOrder(String orderId, String state) throws AppException {
        validateInput(orderId, state);

        Status status;
        try {
            status = Status.valueOf(state.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        Set<Status> allowedStatuses = EnumSet.of(Status.CANCELLED, Status.SHIPPED);
        if (!allowedStatuses.contains(status)) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        OrderEntity orderEntity = orderRepo.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));

        // Giả định bạn có CustomUserPrincipal
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!userId.equals(orderEntity.getUser().getId())) {
            throw new AppException(ErrorCode.NOT_AUTHORIZATION);
        }

        // Optional: check current status logic
        if (orderEntity.getStatus() == Status.SHIPPED) {
            throw new AppException(ErrorCode.ORDER_ALREADY_PROCESSED);
        }

        orderEntity.setStatus(status);
        OrderEntity updated = orderRepo.save(orderEntity);

        return orderMapping.toOrderResponse(updated);
    }

    private void validateInput(String orderId, String state) throws AppException {
        if (orderId == null || orderId.isEmpty() || state == null || state.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }
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
