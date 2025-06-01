package com.kma.shop.service;

import com.kma.shop.dto.request.AddCartItemRequest;
import com.kma.shop.dto.response.OrderResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.entity.OrderNumberEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.entity.UserOrderProductEntity;
import com.kma.shop.enums.Status;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.OrderNumberRepo;
import com.kma.shop.repo.UserOrderProductRepo;
import com.kma.shop.specification.OrderSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;


@Service
@RequiredArgsConstructor
public class UserOrderProductService {
    @Autowired
    private UserOrderProductRepo userOrderProductRepo;
    @Autowired
    private OrderNumberRepo orderNumberRepo;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    public boolean isOrdered(String productId) throws AppException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user  = userService.findUserById(userId);
        ProductEntity product = productService.findById(productId);
        for(OrderNumberEntity entity : user.getOrderProduct().getOrderNumbers()){
            if(product == entity.getProduct()){
                return true;
            }
        }
        return false;
    }

    public void delete(String id){
        orderNumberRepo.deleteById(id);
    }

    public OrderResponse update(String orderId, String state) throws AppException {
        Status status = Status.valueOf(state);
        OrderNumberEntity orderNumberEntity = orderNumberRepo.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        orderNumberEntity.setStatus(status);
        return toOrderResponse(orderNumberRepo.save(orderNumberEntity));
    }



    public OrderResponse order(AddCartItemRequest request) throws AppException {
        checkOrderBefore();
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        UserOrderProductEntity userOrderProductEntity = user.getOrderProduct();
        OrderNumberEntity orderNumberEntity = OrderNumberEntity.builder()
                .number(request.getQuantity())
                .product(productService.findById(request.getProduct_id()))
                .orderProduct(userOrderProductEntity)
                .status(Status.PENDING)
                .build();
        return toOrderResponse(orderNumberRepo.save(orderNumberEntity));
    }

    public OrderResponse getOrderById(String id) throws AppException {
        OrderNumberEntity orderNumberEntity = orderNumberRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toOrderResponse(orderNumberEntity);

    }

    public void checkOrderBefore() throws AppException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        if(user.getOrderProduct() == null)
        {
            UserOrderProductEntity userOrderProductEntity = new UserOrderProductEntity();
            user.setOrderProduct(userOrderProductEntity);
            userService.save(user);
        }
        else{
            if(user.getOrderProduct().getOrderNumbers()  == null){
                user.getOrderProduct().setOrderNumbers(new ArrayList<OrderNumberEntity>());
                userService.save(user);
            }
        }
    }

    public PageResponse<OrderResponse> getMyOrders(String status, String search, int page, int limit) throws AppException {
        Pageable pageable = PageRequest.of(page, limit);
        checkOrderBefore();
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Specification<OrderNumberEntity> spec = Specification
                .where(OrderSpecification.hasStatus(Status.valueOf(status)))
                .and(OrderSpecification.hasProductId(search))
                .and(OrderSpecification.hasUserId(userId));

        Page<OrderNumberEntity> orderNumberEntityPage = orderNumberRepo.findAll(spec, pageable);

        return PageResponse.<OrderResponse>builder()
                .content(orderNumberEntityPage.getContent().stream().map(this::toOrderResponse).toList())
                .pageNumber(orderNumberEntityPage.getNumber())
                .pageSize(orderNumberEntityPage.getSize())
                .totalElements(orderNumberEntityPage.getTotalElements())
                .totalPages(orderNumberEntityPage.getTotalPages())
                .build();
    }

    public OrderResponse toOrderResponse(OrderNumberEntity orderNumberEntity){
        return OrderResponse.builder()
                .id(orderNumberEntity.getId())
                .user_id(orderNumberEntity.getOrderProduct().getUser().getId())
                .created_at(LocalDate.from(orderNumberEntity.getCreationDate()))
                .items_count(orderNumberEntity.getNumber())
                .product_id(orderNumberEntity.getProduct().getId())
                .total_price(orderNumberEntity.getNumber() * orderNumberEntity.getProduct().getPrice())
                .status(orderNumberEntity.getStatus())
                .build();
    }
}
