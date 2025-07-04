package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.OrderRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.exception.AppException;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface OrderService {


    long count();

    @PreAuthorize("hasRole('ROLE_USER')")
    float countTotalPrice();

    boolean isOrderedProductByProductId(String productId);

    boolean existById(String id);

    OrderResponse update(String orderId, String state) throws AppException;

    PageResponse<OrderResponse> getMyOrders(String status, String search, int page, int limit) throws AppException;


    PageResponse<OrderResponse> getAllAdmin(String status, String search, int page, int limit);

    OrderResponse userUpdateQuantityeOrder(String orderId, int quantity) throws AppException;

    OrderResponse userUpdateStateOrder(String orderId, String state) throws AppException;

    OrderResponse create(OrderRequest request) throws AppException;

    @Transactional
    List<OrderResponse> createMultiOrder(List<OrderRequest> requests) throws AppException;

    List<OrderResponse> getOrderResponses(List<String> ids);

    OrderResponse safeGetOrderResponse(String id);

    OrderResponse getOrderResponse(String id) throws AppException;

    void delete(String id) throws AppException;
}
