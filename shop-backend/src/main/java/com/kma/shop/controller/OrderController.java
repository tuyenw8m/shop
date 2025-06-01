package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.AddCartItemRequest;
import com.kma.shop.dto.request.StatusRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.UserOrderProductService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController{
    @Autowired
    private UserOrderProductService userOrderProductService;

    @PutMapping("/{id}")
    public ApiResponse<OrderResponse> update(@PathVariable String id, @RequestBody StatusRequest status) throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(userOrderProductService.update(id, status.getStatus()))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getAll(
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit) throws AppException {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(userOrderProductService.getMyOrders(status, search, page, limit))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> get(@PathVariable String id) throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(userOrderProductService.getOrderById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody AddCartItemRequest request) throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(userOrderProductService.order(request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) throws AppException {
        userOrderProductService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

}
