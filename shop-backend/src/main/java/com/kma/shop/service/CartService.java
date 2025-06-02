package com.kma.shop.service;

import com.kma.shop.dto.request.AddCartItemRequest;
import com.kma.shop.dto.response.CartItemResponse;
import com.kma.shop.dto.response.CartResponse;
import com.kma.shop.entity.CartEntity;
import com.kma.shop.entity.CartItemEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.CartItemRepo;
import com.kma.shop.repo.CartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private CartItemRepo cartItemRepo;

    private CartItemResponse toCartItemResponse(CartItemEntity cart) {
        return CartItemResponse.builder()
                .item_id(cart.getId())
                .product_id(cart.getProduct().getId())
                .name(cart.getProduct().getName())
                .quantity(cart.getQuantity())
                .price(cart.getQuantity() * cart.getProduct().getPrice())
                .build();
    }

    public CartEntity createNewCart(UserEntity user) {
        CartEntity cartEntity = new CartEntity();
        cartEntity.setUser(user);
        cartEntity.setProducts(new ArrayList<>());
        return cartRepo.save(cartEntity);
    }

    public CartItemEntity createNewCartItem(CartEntity cart, ProductEntity product, int quantity) {
        CartItemEntity cartItemEntity = new CartItemEntity();
        cartItemEntity.setProduct(product);
        cartItemEntity.setQuantity(quantity);
        cartItemEntity.setCart(cart);
        return cartItemEntity;
    }

    public CartResponse setUpCartResponseInfo(CartEntity cart) {
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

    public CartResponse getCart() throws AppException {

        //get cart
        String userId =  SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        CartEntity cart = user.getCart();
        if(cart == null) cart = createNewCart(user);

        return setUpCartResponseInfo(cart);
    }

    public void delete(String item_id){
        cartRepo.deleteById(item_id);
    }

     public CartItemResponse update(String item_id, int quantity) throws AppException {

        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);

        CartEntity cart = cartRepo.findByUser(user);
        if (cart == null) {
            throw new AppException(ErrorCode.CONFLICT);
        }

         // Kiểm tra nếu sản phẩm đã có trong cart thì sửa lại số lượng
         for(int i = 0; i < cart.getItems().size(); i++) {
             if(cart.getItems().get(i).getId().equals(item_id)) {
                 cart.getItems().get(i).setQuantity(quantity);
                 cartRepo.save(cart);
                 return toCartItemResponse(cart.getItems().get(i));
             }
         }
        throw new AppException(ErrorCode.CONFLICT);
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

        // Kiểm tra nếu sản phẩm đã có trong cart thì sửa lại số lượng
        for(int i = 0; i < cart.getItems().size(); i++) {
            if(cart.getItems().get(i).getProduct().getId().equals(product.getId())) {
                cart.getItems().get(i).setQuantity(request.getQuantity());
                cartRepo.save(cart);
                return toCartItemResponse(cart.getItems().get(i));
            }
        }

        CartItemEntity item = cartItemRepo.save(createNewCartItem(cart, product, request.getQuantity()));
        return toCartItemResponse(item);
    }
}
