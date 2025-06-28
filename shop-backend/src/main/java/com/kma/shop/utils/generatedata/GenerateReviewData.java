package com.kma.shop.utils.generatedata;

import com.kma.shop.entity.OrderEntity;
import com.kma.shop.entity.ReviewEntity;
import com.kma.shop.mapping.ReviewMapping;
import com.kma.shop.repo.OrderRepo;
import com.kma.shop.repo.ReviewRepo;
import com.kma.shop.service.interfaces.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GenerateReviewData {
    ReviewRepo reviewRepo;
    OrderRepo orderRepo;
    ReviewMapping reviewMapping;
    Random random = new Random();

    static String COMMENT_BASE = "Sản phẩm tạm được";

    public void generate(){
        if(reviewRepo.count() < 1){
            List<ReviewEntity> reviews = new ArrayList<>();
            List<OrderEntity> orders = orderRepo.findAll();
            for (OrderEntity order : orders) {
                ReviewEntity review = reviewMapping
                        .buildReviewBase(order.getUser(), order.getProduct(), random.nextInt(5) + 1, COMMENT_BASE);
                reviews.add(review);
            }
            reviewRepo.saveAll(reviews);
        }
    }
}
