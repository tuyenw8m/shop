package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.OrderRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.exception.AppException;

import java.util.List;

public interface OrderService {

    boolean isOrderedProduct(String productId);

    boolean isOrdered(String id);

    OrderResponse update(String orderId, String state) throws AppException;

    PageResponse<OrderResponse> getMyOrders(String status, String search, int page, int limit) throws AppException;

    OrderResponse create(OrderRequest request) throws AppException;

    List<OrderResponse> getOrderResponses(List<String> ids);

    OrderResponse safeGetOrderResponse(String id);

    OrderResponse getOrderResponse(String id) throws AppException;

    void delete(String id) throws AppException;
}
