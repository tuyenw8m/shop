package com.kma.shop.service;

import com.kma.shop.dto.request.AddCartItemRequest;
import com.kma.shop.dto.response.CartItemResponse;
import com.kma.shop.dto.response.CartResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.entity.CartEntity;
import com.kma.shop.entity.CartItemEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.repo.CartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    private CartItemResponse toCartItemResponse(CartItemEntity cart) {
        return CartItemResponse.builder()
                .item_id(cart.getId())
                .product_id(cart.getProduct().getId())
                .name(cart.getProduct().getName())
                .quantity(cart.getQuantity())
                .price(cart.getQuantity() * cart.getProduct().getPrice())
                .build();
    }

    public CartResponse getCart() throws AppException {
        String userId =  SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        CartEntity cart = user.getCart();
        List<CartItemResponse> cartItemResponses = new ArrayList<>();
        float totalPrice = 0;
        int totalQuantity = 0;
        for(CartItemEntity item : cart.getItems()) {
            cartItemResponses.add(toCartItemResponse(item));
            totalQuantity += item.getQuantity();
            totalPrice += item.getProduct().getPrice() * item.getQuantity();
        }
        return CartResponse.builder()
                .items(cartItemResponses)
                .total_items(totalQuantity)
                .total_price(totalPrice)
                .build();
    }

    public void delete(String item_id){
        cartRepo.deleteById(item_id);
    }

     public CartItemResponse update(String item_id, int quantity) throws AppException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        ProductEntity product = productService.findById(item_id);

        CartEntity cart = cartRepo.findByUser(user);
        if (cart == null) {
            cart = new CartEntity();
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
        }

        Optional<CartItemEntity> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();
        CartItemEntity item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            item.setQuantity(quantity);
        } else {
            return null;
        }
        cartRepo.save(cart);
        return toCartItemResponse(item);
    }

    public CartItemResponse add(AddCartItemRequest request) throws AppException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        ProductEntity product = productService.findById(request.getProduct_id());

        CartEntity cart = cartRepo.findByUser(user);
        if (cart == null) {
            cart = new CartEntity();
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
        }

        // Kiểm tra nếu sản phẩm đã có trong cart thì tăng số lượng
        Optional<CartItemEntity> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();
        CartItemEntity item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());

        } else {
            item = new CartItemEntity();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            cart.getItems().add(item);
        }
        cartRepo.save(cart);

        // Trả response
        return toCartItemResponse(item);
    }
}
