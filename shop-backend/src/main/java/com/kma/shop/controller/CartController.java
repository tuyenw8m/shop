package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.AddCartItemRequest;
import com.kma.shop.dto.response.CartItemResponse;
import com.kma.shop.dto.response.CartResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart() throws AppException {
        return ApiResponse.<CartResponse>builder()
                .data(cartService.getCart())
                .build();
    }

    @PostMapping
    public ApiResponse<CartItemResponse> add(@RequestBody AddCartItemRequest request) throws AppException {
        return ApiResponse.<CartItemResponse>builder()
                .data(cartService.add(request))
                .build();
    }

    @PutMapping("/{item_id}")
    public ApiResponse<CartItemResponse> update(@PathVariable String item_id, @RequestBody AddCartItemRequest request) throws AppException {
        return ApiResponse.<CartItemResponse>builder()
                .data(cartService.update(item_id, request.getQuantity()))
                .build();
    }

    @DeleteMapping("/{item_id}")
    public ApiResponse<Void> delete(@PathVariable String item_id) throws AppException {
        cartService.delete(item_id);
        return ApiResponse.<Void>builder()
                .build();
    }
}

