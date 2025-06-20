package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.AddCartItemRequest;
import com.kma.shop.dto.response.CartItemResponse;
import com.kma.shop.dto.response.CartResponse;
import com.kma.shop.entity.CartEntity;
import com.kma.shop.entity.CartItemEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;

public interface CartService {
    CartItemResponse toCartItemResponse(CartItemEntity cart);

    CartEntity createNewCart(UserEntity user);

    CartItemEntity createNewCartItem(CartEntity cart, ProductEntity product, int quantity);

    CartResponse setUpCartResponseInfo(CartEntity cart);

    CartResponse getCart() throws AppException;

    void deleteItemInCart(String item_id);

    CartItemResponse update(String item_id, int quantity) throws AppException;

    CartItemResponse add(AddCartItemRequest request) throws AppException;
}
