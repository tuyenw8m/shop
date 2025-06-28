package com.kma.shop.utils.generatedata;

import com.github.javafaker.Faker;
import com.kma.shop.entity.OrderEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.mapping.OrderMapping;
import com.kma.shop.repo.OrderRepo;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.repo.UserRepo;
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
public class GenerateOrderData {
    OrderRepo orderRepo;
    OrderMapping orderMapping;
    UserRepo userRepo;
    ProductRepo productRepo;
    Faker faker;

    Random random = new Random();

    // Realistic order comments
    private final List<String> orderComments = Arrays.asList(
        "Giao hàng nhanh, đóng gói cẩn thận nhé!",
        "Sản phẩm chính hãng, bảo hành đầy đủ.",
        "Giao vào giờ hành chính, cảm ơn shop!",
        "Sản phẩm đúng như mô tả, rất hài lòng.",
        "Đóng gói kỹ lưỡng, không bị trầy xước.",
        "Giao hàng đúng hẹn, nhân viên thân thiện.",
        "Sản phẩm chất lượng tốt, giá hợp lý.",
        "Giao vào buổi sáng, thuận tiện cho công việc.",
        "Đóng gói đẹp, sản phẩm mới 100%.",
        "Giao hàng nhanh, sản phẩm đúng như quảng cáo.",
        "Cảm ơn shop đã tư vấn nhiệt tình.",
        "Sản phẩm đúng thương hiệu, yên tâm sử dụng.",
        "Giao hàng đúng địa chỉ, nhân viên lịch sự.",
        "Đóng gói chắc chắn, không bị hư hỏng.",
        "Sản phẩm chất lượng cao, đáng mua!",
        "Giao hàng miễn phí, tiết kiệm chi phí.",
        "Sản phẩm mới nhất, công nghệ tiên tiến.",
        "Giao hàng đúng giờ, rất chuyên nghiệp.",
        "Đóng gói gọn gàng, dễ vận chuyển.",
        "Sản phẩm phù hợp với nhu cầu sử dụng."
    );

    // Special comments for different product types
    private final List<String> laptopOrderComments = Arrays.asList(
        "Laptop gaming cấu hình mạnh, phù hợp chơi game.",
        "Laptop văn phòng nhẹ, pin trâu, dễ mang theo.",
        "Laptop đồ họa màn hình đẹp, xử lý tốt.",
        "Laptop sinh viên giá hợp lý, đủ dùng cho học tập.",
        "Laptop doanh nhân thiết kế sang trọng, bảo mật tốt."
    );

    private final List<String> cameraOrderComments = Arrays.asList(
        "Camera chụp ảnh sắc nét, zoom quang học tốt.",
        "Camera an ninh hoạt động ổn định, app dễ sử dụng.",
        "Webcam chất lượng cao, phù hợp họp online.",
        "Camera hành trình gọn nhẹ, chống rung tốt.",
        "Camera chuyên nghiệp, phù hợp studio."
    );

    private final List<String> componentOrderComments = Arrays.asList(
        "Linh kiện chính hãng, tương thích tốt với hệ thống.",
        "CPU hiệu năng cao, tản nhiệt tốt.",
        "RAM tốc độ cao, phù hợp gaming và đồ họa.",
        "SSD khởi động nhanh, lưu trữ ổn định.",
        "GPU mạnh mẽ, chơi game mượt mà."
    );

    public void generate(){
        if(orderRepo.count() < 1){
            List<UserEntity> users = userRepo.findAll();
            List<ProductEntity> products = productRepo.findAll();
            
            if (users.isEmpty() || products.isEmpty()) {
                System.out.println("⚠️ No users or products found. Skipping order generation.");
                return;
            }
            
            List<OrderEntity> orders = new ArrayList<>(800); // Reduced to 800 orders for better distribution
            
            System.out.println("🔄 Generating orders for " + users.size() + " users and " + products.size() + " products...");
            
            // Generate orders with realistic distribution
            for(int i = 0; i < 800; i++){
                UserEntity user = users.get(random.nextInt(users.size()));
                ProductEntity product = products.get(random.nextInt(products.size()));
                
                // Generate realistic quantity (1-3 for most products, 1 for expensive items)
                int quantity = generateRealisticQuantity(product.getPrice());
                
                // Generate appropriate comment based on product type
                String comment = generateRealisticComment(product.getName());
                
                OrderEntity orderEntity = orderMapping
                        .buildOrderBase(user, product, quantity, comment);
                orders.add(orderEntity);
            }
            
            orderRepo.saveAll(orders);
            System.out.println("✅ Generated " + orders.size() + " orders successfully");
        }
    }

    private int generateRealisticQuantity(float price) {
        // More expensive products have lower quantities
        if (price > 50000000) { // > 50M VND
            return 1;
        } else if (price > 20000000) { // > 20M VND
            return random.nextInt(2) + 1; // 1-2
        } else if (price > 10000000) { // > 10M VND
            return random.nextInt(3) + 1; // 1-3
        } else if (price > 5000000) { // > 5M VND
            return random.nextInt(4) + 1; // 1-4
        } else {
            return random.nextInt(5) + 1; // 1-5
        }
    }

    private String generateRealisticComment(String productName) {
        String productNameLower = productName.toLowerCase();
        
        // Category-specific comments
        if (productNameLower.contains("laptop") || productNameLower.contains("pc") || 
            productNameLower.contains("macbook") || productNameLower.contains("thinkbook")) {
            return laptopOrderComments.get(random.nextInt(laptopOrderComments.size()));
        } else if (productNameLower.contains("camera") || productNameLower.contains("webcam") || 
                   productNameLower.contains("gopro") || productNameLower.contains("canon")) {
            return cameraOrderComments.get(random.nextInt(cameraOrderComments.size()));
        } else if (productNameLower.contains("cpu") || productNameLower.contains("ram") || 
                   productNameLower.contains("ssd") || productNameLower.contains("gpu") ||
                   productNameLower.contains("mainboard") || productNameLower.contains("psu")) {
            return componentOrderComments.get(random.nextInt(componentOrderComments.size()));
        }
        
        // General comments
        return orderComments.get(random.nextInt(orderComments.size()));
    }
}
