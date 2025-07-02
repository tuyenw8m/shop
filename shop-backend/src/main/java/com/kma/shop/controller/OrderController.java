package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.OrderRequest;
import com.kma.shop.dto.request.StatusRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.OrderService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @GetMapping("/count")
    public ApiResponse<Float> countTotalPrice() {
        return ApiResponse.<Float>builder()
                .data(orderService.countTotalPrice())
                .build();
    }

    @PutMapping("/{id}")
    @Transactional
    public ApiResponse<OrderResponse> update(@PathVariable String id, @RequestBody StatusRequest status)
            throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.update(id, status.getStatus()))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<OrderResponse>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit) throws AppException {
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .data(orderService.getMyOrders(status, search, page - 1, limit))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> get(@PathVariable String id) throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.getOrderResponse(id))
                .build();
    }

    @PostMapping
    @Transactional
    public ApiResponse<OrderResponse> create(@RequestBody OrderRequest request) throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.create(request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) throws AppException {
        orderService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PutMapping("/{id}/cancel")
    @Transactional
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable String id) throws AppException {
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.userUpdateStateOrder(id, "CANCELLED"))
                .build();
    }

}
