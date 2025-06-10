package com.kma.shop.controller;

import com.github.javafaker.Faker;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.repo.CategoryRepo;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepo repo;
    private final Faker faker;
    private final CategoryRepo categoryRepo;
    private  final ProductRepo productRepo;
    private static List<String> categoryNames = Arrays.asList(
            "Linh kiện máy tính",
            "Thiết bị điện tử",
            "Thiết bị mạng",
            "Thiết bị ngoại vi",
            "Phụ kiện công nghệ",
            "Laptop & Máy tính xách tay",
            "Màn hình máy tính",
            "Chuột máy tính",
            "Bàn phím cơ",
            "Tai nghe",
            "Loa Bluetooth",
            "Ổ cứng SSD",
            "Ổ cứng HDD",
            "CPU - Bộ vi xử lý",
            "Mainboard - Bo mạch chủ",
            "RAM - Bộ nhớ trong",
            "Card màn hình - GPU",
            "Nguồn máy tính - PSU",
            "Vỏ case máy tính",
            "Quạt tản nhiệt",
            "Thiết bị lưu trữ di động",
            "Thiết bị Smart Home",
            "Camera an ninh",
            "Máy in & Máy scan",
            "Thiết bị trình chiếu"
    );




    @Override
    public void run(String... args) throws Exception {
        if(categoryRepo.count() < 0) {
            List<CategoryEntity> categories = new ArrayList<>();
            for(String categoryName : categoryNames) {
                CategoryEntity category  = CategoryEntity.builder()
                        .name(categoryName)
                        .description(faker.lorem().sentence())
                        .build();
                categories.add(category);
            }
            categoryRepo.saveAll(categories);
        }

        if(repo.count() < 1000) {
            for (int i = 0; i < 1000; i++) {
                UserEntity user = new UserEntity();
                user.setEmail(faker.internet().emailAddress());
                user.setPhone(faker.phoneNumber().cellPhone());
                user.setAddress(faker.address().fullAddress());
                user.setName(faker.name().username());
                user.setPassword("123456"); // Đặt cứng cho đơn giản

                repo.save(user);
            }
        }


    }

    public void product(){
        List<CategoryEntity> allCategories = categoryRepo.findAll();
        if (productRepo.count() < 10000) {
            List<ProductEntity> products = new ArrayList<>();
            Random rand = new Random();
            List<String> brands = Arrays.asList("Intel", "AMD", "Asus", "MSI", "Samsung", "Logitech", "Kingston", "Corsair");
            List<String> types = Arrays.asList("CPU", "Mainboard", "RAM", "SSD", "Card màn hình", "Màn hình", "Chuột", "Bàn phím");
            List<String> specs = Arrays.asList("i5-12400F", "B660M", "16GB DDR4", "512GB NVMe", "RTX 4060", "24 inch 144Hz", "Bluetooth", "RGB");

            for (int i = 0; i < 10000; i++) {
                // Chọn brand/type/spec ngẫu nhiên
                String brand = brands.get(rand.nextInt(brands.size()));
                String type = types.get(rand.nextInt(types.size()));
                String spec = specs.get(rand.nextInt(specs.size()));
                String name = brand + " " + type + " " + spec;

                // Chọn ngẫu nhiên 1–2 category
                Set<CategoryEntity> categoryEntities = new HashSet<>();
                categoryEntities.add(allCategories.get(rand.nextInt(allCategories.size())));
                if (rand.nextBoolean()) {
                    categoryEntities.add(allCategories.get(rand.nextInt(allCategories.size())));
                }



                // Tạo product
                ProductEntity product = ProductEntity.builder()
                        .name(name)
                        .price(rand.nextFloat() * 15000000)
                        .stock(rand.nextInt(100))
                        .description(faker.lorem().sentence())
                        .technical_specs(faker.lorem().sentence())
                        .highlight_specs(faker.lorem().sentence())
                        .categories(new ArrayList<>(categoryEntities))
                        .build();
                products.add(product);
            }

            productRepo.saveAll(products);
        }
    }
}
