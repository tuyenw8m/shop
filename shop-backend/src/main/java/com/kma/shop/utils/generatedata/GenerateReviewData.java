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
import java.util.Arrays;
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

    // Realistic review comments for different product categories
    private final List<String> positiveComments = Arrays.asList(
        "Sản phẩm chất lượng rất tốt, đóng gói cẩn thận!",
        "Giao hàng nhanh, sản phẩm đúng như mô tả. Rất hài lòng!",
        "Chất lượng vượt mong đợi, giá cả hợp lý. Sẽ mua lại!",
        "Sản phẩm hoạt động ổn định, thiết kế đẹp mắt.",
        "Dịch vụ khách hàng tốt, sản phẩm đáng tin cậy.",
        "Đã sử dụng được 2 tháng, hiệu suất rất ổn định.",
        "Thiết kế hiện đại, dễ sử dụng, phù hợp với nhu cầu.",
        "Chất lượng build tốt, vật liệu cao cấp.",
        "Hiệu năng vượt trội so với giá tiền, đáng mua!",
        "Sản phẩm chính hãng, bảo hành đầy đủ, yên tâm sử dụng."
    );

    private final List<String> neutralComments = Arrays.asList(
        "Sản phẩm tạm được, đáp ứng cơ bản nhu cầu sử dụng.",
        "Chất lượng ổn, nhưng có thể cải thiện thêm một số chi tiết.",
        "Giao hàng đúng hẹn, sản phẩm hoạt động bình thường.",
        "Thiết kế đơn giản, dễ sử dụng cho người mới.",
        "Giá cả phù hợp với chất lượng, không quá xuất sắc.",
        "Sản phẩm đúng như quảng cáo, không có gì đặc biệt.",
        "Chất lượng trung bình, phù hợp với mức giá.",
        "Dễ lắp đặt và sử dụng, phù hợp cho gia đình.",
        "Sản phẩm ổn định, không gặp vấn đề gì lớn.",
        "Đóng gói cẩn thận, giao hàng nhanh chóng."
    );

    private final List<String> negativeComments = Arrays.asList(
        "Sản phẩm có vấn đề về chất lượng, không như mong đợi.",
        "Giao hàng chậm, sản phẩm có dấu hiệu đã qua sử dụng.",
        "Thiết kế không tiện dụng, khó lắp đặt.",
        "Hiệu năng kém hơn so với mô tả, thất vọng.",
        "Giá cao nhưng chất lượng không tương xứng.",
        "Sản phẩm bị lỗi ngay sau khi mở hộp.",
        "Dịch vụ khách hàng chậm trễ, không hài lòng.",
        "Thiết kế cồng kềnh, không phù hợp với không gian.",
        "Chất liệu rẻ tiền, dễ hỏng sau thời gian ngắn.",
        "Không đáng với số tiền bỏ ra, không khuyến khích mua."
    );

    // Category-specific comments
    private final List<String> laptopComments = Arrays.asList(
        "Laptop chạy mượt, pin trâu, phù hợp cho công việc và học tập.",
        "Thiết kế đẹp, màn hình sắc nét, hiệu năng gaming tốt.",
        "Cấu hình mạnh, xử lý đa nhiệm tốt, giá hợp lý.",
        "Màn hình Full HD đẹp, âm thanh tốt, webcam rõ nét.",
        "Laptop nhẹ, dễ mang theo, pin trâu, phù hợp sinh viên."
    );

    private final List<String> cameraComments = Arrays.asList(
        "Camera chụp ảnh sắc nét, video ổn định, dễ sử dụng.",
        "Chất lượng hình ảnh tốt, zoom quang học hiệu quả.",
        "Thiết kế gọn nhẹ, chống rung tốt, phù hợp du lịch.",
        "Camera an ninh hoạt động ổn định, app dễ sử dụng.",
        "Webcam chất lượng cao, phù hợp họp online và streaming."
    );

    private final List<String> componentComments = Arrays.asList(
        "Linh kiện chính hãng, hiệu năng ổn định, tản nhiệt tốt.",
        "Tốc độ xử lý nhanh, tương thích tốt với mainboard.",
        "RAM chạy ổn định, tần số cao, phù hợp gaming.",
        "SSD tốc độ cao, khởi động nhanh, không gây tiếng ồn.",
        "PSU ổn định, tiết kiệm điện, bảo vệ tốt cho hệ thống."
    );

    public void generate(){
        if(reviewRepo.count() < 1){
            List<ReviewEntity> reviews = new ArrayList<>();
            List<OrderEntity> orders = orderRepo.findAll();
            
            System.out.println("🔄 Generating reviews for " + orders.size() + " orders...");
            
            for (OrderEntity order : orders) {
                // Generate rating with realistic distribution (more positive ratings)
                int rating = generateRealisticRating();
                String comment = generateRealisticComment(order.getProduct().getName(), rating);
                
                ReviewEntity review = reviewMapping
                        .buildReviewBase(order.getUser(), order.getProduct(), rating, comment);
                reviews.add(review);
            }
            
            reviewRepo.saveAll(reviews);
            System.out.println("✅ Generated " + reviews.size() + " reviews successfully");
        }
    }

    private int generateRealisticRating() {
        // Realistic rating distribution: 60% 4-5 stars, 30% 3 stars, 10% 1-2 stars
        int rand = random.nextInt(100);
        if (rand < 60) {
            return random.nextInt(2) + 4; // 4-5 stars
        } else if (rand < 90) {
            return 3; // 3 stars
        } else {
            return random.nextInt(2) + 1; // 1-2 stars
        }
    }

    private String generateRealisticComment(String productName, int rating) {
        String productNameLower = productName.toLowerCase();
        
        // Category-specific comments
        if (productNameLower.contains("laptop") || productNameLower.contains("pc") || 
            productNameLower.contains("macbook") || productNameLower.contains("thinkbook")) {
            return laptopComments.get(random.nextInt(laptopComments.size()));
        } else if (productNameLower.contains("camera") || productNameLower.contains("webcam") || 
                   productNameLower.contains("gopro") || productNameLower.contains("canon")) {
            return cameraComments.get(random.nextInt(cameraComments.size()));
        } else if (productNameLower.contains("cpu") || productNameLower.contains("ram") || 
                   productNameLower.contains("ssd") || productNameLower.contains("gpu") ||
                   productNameLower.contains("mainboard") || productNameLower.contains("psu")) {
            return componentComments.get(random.nextInt(componentComments.size()));
        }
        
        // General comments based on rating
        if (rating >= 4) {
            return positiveComments.get(random.nextInt(positiveComments.size()));
        } else if (rating == 3) {
            return neutralComments.get(random.nextInt(neutralComments.size()));
        } else {
            return negativeComments.get(random.nextInt(negativeComments.size()));
        }
    }
}
