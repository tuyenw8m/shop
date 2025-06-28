package com.kma.shop.utils.generatedata;

import com.github.javafaker.Faker;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.mapping.OrderMapping;
import com.kma.shop.repo.OrderRepo;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.repo.UserRepo;
import com.kma.shop.service.interfaces.OrderService;
import com.kma.shop.service.interfaces.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.catalina.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GenerateOrderData {
    OrderRepo orderRepo;
    OrderMapping orderMapping;
    UserRepo userRepo;
    ProductRepo productRepo;
    Faker faker;

    Random random = new Random();

    static String COMMENT_BASE = "Tôi muốn mua hàng";

    public void generate(){
        if(orderRepo.count() < 1){
            List<UserEntity> users = userRepo.findAll();
            List<ProductEntity> products = productRepo.findAll();
            List<OrderEntity> order = new ArrayList<>(1000);
            for(int i = 0; i < 1000; i++){
                OrderEntity orderEntity = orderMapping
                        .buildOrderBase(users.get(random.nextInt(users.size())),
                        products.get(random.nextInt(products.size())), random.nextInt(5), COMMENT_BASE);
                order.add(orderEntity);
            }
            orderRepo.saveAll(order);
        }
    }
}
