package com.kma.shop.utils;

import com.kma.shop.entity.*;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.service.interfaces.CategoryServiceV2;
import com.kma.shop.service.interfaces.ProductServiceV2;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional; // Import this

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenerateProductData {
    CategoryServiceV2 categoryServiceV2;
    ProductServiceV2 productServiceV2;
    Random random = new Random();
    ProductRepo productRepo;

    public GenerateProductData(CategoryServiceV2 categoryServiceV2, ProductServiceV2 productServiceV2, ProductRepo productRepo) {
        this.categoryServiceV2 = categoryServiceV2;
        this.productServiceV2 = productServiceV2;
        this.productRepo = productRepo;
    }

    @Transactional // Quan trọng để đảm bảo tất cả các thao tác lưu đều nằm trong một transaction
    public void generate() throws AppException {
        if (productServiceV2.count() < 20) {
            List<ParentCategoryEntity> parents = categoryServiceV2.findAllParents();
            if (parents.isEmpty()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }

            for (ParentCategoryEntity parent : parents) {
                List<ChildCategoryEntity> childCategoriesOfParent = parent.getChildCategories();
                if (childCategoriesOfParent.isEmpty()) {
                    System.out.println("Skipping parent category '" + parent.getName() + "' as it has no child categories.");
                    continue;
                }
                // Collect all unique branches linked to the child categories of this parent
                List<BranchEntity> availableBranches = childCategoriesOfParent.stream()
                        .flatMap(child -> child.getBranches().stream())
                        .distinct()
                        .collect(Collectors.toList());

                if (availableBranches.isEmpty()) {
                    System.out.println("Skipping parent category '" + parent.getName() + "' as no branches are linked to its child categories.");
                    continue;
                }

                generateProductsForParentCategory(parent, childCategoriesOfParent, availableBranches);
            }
            System.out.println("Successfully generated initial product data.");
        } else {
            System.out.println("Skipping product generation, more than 20 products already exist.");
        }
    }

    // Đổi tên phương thức để rõ ràng hơn rằng nó tạo sản phẩm cho một Parent Category
    private void generateProductsForParentCategory(ParentCategoryEntity parent, List<ChildCategoryEntity> childCategoriesOfParent, List<BranchEntity> availableBranches) throws AppException {
        int numberOfProducts = random.nextInt(3) + 3; // Generate 3-5 products for this parent's ecosystem
        System.out.println("Generating " + numberOfProducts + " products for parent category: " + parent.getName());

        for (int i = 0; i < numberOfProducts; i++) {
            // Pick 1-3 child categories for each product
            List<ChildCategoryEntity> selectedChildCategories = new ArrayList<>();
            int numChildCategoriesForProduct = random.nextInt(3) + 1; // 1-3 child categories
            Collections.shuffle(childCategoriesOfParent, random); // Shuffle to pick random ones

            for (int j = 0; j < numChildCategoriesForProduct && j < childCategoriesOfParent.size(); j++) {
                selectedChildCategories.add(childCategoriesOfParent.get(j));
            }

            // Select a random branch for the product
            BranchEntity selectedBranch = availableBranches.get(random.nextInt(availableBranches.size()));

            ProductEntity product = buildProduct(parent, selectedChildCategories, selectedBranch);

            // --- THIẾT LẬP MỐI QUAN HỆ HAI CHIỀU SAU KHI SẢN PHẨM ĐƯỢC TẠO ---

            // 1. Đối với ImageEntity (nếu bạn sử dụng ImageEntity.class, tôi đang sửa ProductImageEntity)
            // Đảm bảo ProductImageEntity có setProduct()
            if (product.getImages() != null) {
                product.getImages().forEach(image -> image.setProduct(product));
            }
            // Tương tự cho imageV1 nếu bạn đang dùng ImageEntity
            // if (product.getImageV1() != null) {
            //     product.getImageV1().forEach(image -> image.setProduct(product));
            // }


            // 2. Đối với ChildCategoryEntity (ManyToMany)
            // Vì ChildCategoryEntity là bên sở hữu mối quan hệ, bạn cần thêm product vào danh sách của nó.
            for (ChildCategoryEntity child : selectedChildCategories) {
                if (child.getProducts() == null) {
                    child.setProducts(new ArrayList<>());
                }
                if (!child.getProducts().contains(product)) { // Tránh thêm trùng lặp
                    child.getProducts().add(product);
                }
            }

            // 3. Đối với BranchEntity (ManyToOne từ Product, OneToMany từ Branch)
            // Cũng nên thêm sản phẩm vào danh sách sản phẩm của chi nhánh để đảm bảo tính nhất quán
            if (selectedBranch.getProduct() == null) {
                selectedBranch.setProduct(new ArrayList<>());
            }
            if (!selectedBranch.getProduct().contains(product)) { // Tránh thêm trùng lặp
                selectedBranch.getProduct().add(product);
            }

            // 4. Đối với ParentCategoryEntity (ManyToOne từ Product, OneToMany từ ParentCategory)
            // Nếu bạn giữ mối quan hệ này, bạn cũng nên thiết lập chiều ngược lại
            if (parent.getProducts() == null) {
                parent.setProducts(new ArrayList<>());
            }
            if (!parent.getProducts().contains(product)) {
                parent.getProducts().add(product);
            }


            // Lưu sản phẩm. Do các CASCADE TYPE được cấu hình, các thực thể liên quan sẽ được lưu theo.
            try {
                productRepo.save(product);
                System.out.println("Saved product: " + product.getName() + " (ID: " + product.getId() + ")");
            } catch (Exception e) {
                System.err.println("Error saving product: " + product.getName() + " - " + e.getMessage());
                // Rethrow or handle based on your error policy
                throw new AppException(ErrorCode.CONFLICT);
            }
        }
    }


    private ProductEntity buildProduct(ParentCategoryEntity parent, List<ChildCategoryEntity> childCategories, BranchEntity branch) {
        String name = generateProductName(parent.getName(), childCategories.get(0).getName()); // Use first child for naming
        float price = generatePrice(parent.getName());
        String description = generateDescription(parent.getName(), childCategories.get(0).getName());
        String features = generateFeatures(parent.getName(), childCategories.get(0).getName());
        String technicalSpecs = generateTechnicalSpecs(parent.getName(), childCategories.get(0).getName());
        String highlightSpecs = generateHighlightSpecs(parent.getName(), childCategories.get(0).getName());
        String promotions = generatePromotions();
        int sold = random.nextInt(500);
        int rating = random.nextInt(3) + 3; // 3-5 stars
        int stock = random.nextInt(50) + 10; // 10-59 units

        List<ProductImageEntity> productImageEntities =
                new ArrayList<>(List.of(buildProductImageEntity(generateImageLink()), buildProductImageEntity(generateImageLink())));

        // Tạo ProductEntity. Lombok's @Builder giúp tạo đối tượng dễ dàng.
        // Tuy nhiên, bạn cần đảm bảo các field khác như `id` được handle bởi FormEntity
        // hoặc ProductEntity có `@Id` và `@GeneratedValue`
        ProductEntity newProduct = ProductEntity.builder()
                .name(name)
                .price(price)
                .original_price(price)
                .description(description)
                .features(features)
                .technical_specs(technicalSpecs)
                .highlight_specs(highlightSpecs)
                .promotions(promotions)
                .sold(sold)
                .rating(rating)
                .stock(stock)
                .images(productImageEntities) // Gán danh sách ảnh
                .parentCategory(parent)
                .childCategories(childCategories) // Gán danh sách child categories
                .categories(new ArrayList<>()) // Giữ nguyên, nếu không dùng thì có thể xóa
                .branch(branch) // Gán branch
                .build();

        // --- ĐÂY LÀ PHẦN QUAN TRỌNG: THIẾT LẬP CHIỀU NGƯỢC LẠI CỦA MỐI QUAN HỆ ---
        // Đối với OneToMany (từ ProductImageEntity tới ProductEntity)
        // Mỗi ProductImageEntity cần biết nó thuộc về ProductEntity nào
        if (productImageEntities != null) {
            for (ProductImageEntity image : productImageEntities) {
                image.setProduct(newProduct); // Thiết lập mối quan hệ ngược
            }
        }
        // Tương tự cho ImageEntity nếu bạn sử dụng imageV1
        // newProduct.getImageV1().forEach(image -> image.setProduct(newProduct));

        // Đối với ManyToMany (từ ChildCategoryEntity tới ProductEntity)
        // Mặc dù ProductEntity đã có danh sách childCategories,
        // ChildCategoryEntity (bên sở hữu) cũng cần được cập nhật.
        // Sẽ được xử lý trong `generateProductsForParentCategory` trước khi lưu.

        return newProduct;
    }

    // --- Các phương thức generate khác không đổi ---
    private ProductImageEntity buildProductImageEntity(String link) {
        // Assume ProductImageEntity also has a builder and a 'url' field.
        // It also needs a 'product' field and a setter for it.
        return ProductImageEntity.builder()
                .url(link)
                .build();
    }

    private String generateProductName(String parentName, String childName) {
        List<String> brands = Arrays.asList("Sony", "Canon", "Nikon", "Asus", "Dell", "HP", "MSI", "Gigabyte", "Intel", "AMD", "Corsair", "Samsung", "Kingston");
        List<String> models = Arrays.asList("Alpha", "Pro", "Elite", "Z", "X", "Gamer", "Ultra", "Neo", "Core", "Max", "Prime", "Vivid", "Turbo");

        String brand = brands.get(random.nextInt(brands.size()));
        String model = models.get(random.nextInt(models.size()));
        String suffix = switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Act" + random.nextInt(100);
                case "Camera chuyên nghiệp" -> "Pro" + random.nextInt(1000);
                case "Webcam" -> "Web" + random.nextInt(50);
                case "Camera an ninh/IP" -> "IP" + random.nextInt(200);
                case "Camera hành trình" -> "Dash" + random.nextInt(300);
                default -> "Cam" + random.nextInt(100);
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "Game" + random.nextInt(500);
                case "PC đồ họa / workstation" -> "Work" + random.nextInt(200);
                case "Mini PC" -> "Mini" + random.nextInt(100);
                case "PC để bàn" -> "Desk" + random.nextInt(300);
                case "Laptop" -> "Lap" + random.nextInt(400);
                default -> "PC" + random.nextInt(100);
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "C" + random.nextInt(50);
                case "Tản nhiệt" -> "Cool" + random.nextInt(60);
                case "PSU" -> "PSU" + random.nextInt(700);
                case "GPU" -> "GPU" + random.nextInt(800);
                case "Mainboard" -> "MB" + random.nextInt(300);
                case "SSD/HDD" -> "Drive" + random.nextInt(200);
                case "RAM" -> "RAM" + random.nextInt(16);
                case "CPU" -> "CPU" + random.nextInt(9);
                default -> "Comp" + random.nextInt(100);
            };
            default -> "Product" + random.nextInt(1000);
        };
        return brand + " " + model + " " + suffix;
    }

    private float generatePrice(String parentName) {
        return switch (parentName) {
            case "Camera" -> 5000000 + random.nextFloat() * 25000000; // 5M - 30M VND
            case "Máy tính" -> 10000000 + random.nextFloat() * 40000000; // 10M - 50M VND
            case "Linh kiện" -> 500000 + random.nextFloat() * 15000000; // 0.5M - 15.5M VND
            default -> 1000000 + random.nextFloat() * 10000000; // 1M - 11M VND
        };
    }

    private String generateImageLink() {
        List<String> links = Arrays.asList(
                "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1527097779402-4a4b213307fc?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1520549233664-03f65c1d1327?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1515519128511-cbd81859fa91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://plus.unsplash.com/premium_photo-1711136677946-27ffc2a8cf7b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1542445372-960567a27047?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://plus.unsplash.com/premium_photo-1676760960755-bb03532a8ca3?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1611633235555-45e252fe48c8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://plus.unsplash.com/premium_photo-1675371421686-d092d62b75d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://plus.unsplash.com/premium_photo-1676760960755-bb03532a8ca3?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        );
        return links.get(random.nextInt(links.size()));
    }

    private String generateDescription(String parentName, String childName) {
        List<String> descriptors = Arrays.asList(
                "Thiết kế hiện đại, hiệu suất vượt trội, phù hợp cho mọi nhu cầu.",
                "Sản phẩm chất lượng cao, bền bỉ và đáng tin cậy.",
                "Tối ưu hóa cho hiệu suất, mang lại trải nghiệm mượt mà.",
                "Công nghệ tiên tiến, đáp ứng tốt các tác vụ chuyên sâu.",
                "Lý tưởng cho cả công việc và giải trí."
        );
        return descriptors.get(random.nextInt(descriptors.size())) + " Dành cho " + childName + " trong danh mục " + parentName + ".";
    }

    private String generateFeatures(String parentName, String childName) {
        return switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Chống nước, quay 4K, góc rộng 170°";
                case "Camera chuyên nghiệp" -> "Cảm biến Full-frame, ISO 100-51200, 10fps";
                case "Webcam" -> "1080p, mic tích hợp, tự động lấy nét";
                case "Camera an ninh/IP" -> "Hồng ngoại ban đêm, kết nối Wi-Fi, AI phát hiện chuyển động";
                case "Camera hành trình" -> "Ghi hình Full HD, GPS tích hợp, góc 140°";
                default -> "Chất lượng hình ảnh cao, dễ sử dụng";
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "GPU RTX, 16GB RAM, tản nhiệt nước";
                case "PC đồ họa / workstation" -> "CPU 12 nhân, 32GB RAM, SSD 1TB";
                case "Mini PC" -> "Thiết kế nhỏ gọn, tiết kiệm năng lượng, 8GB RAM";
                case "PC để bàn" -> "Hiệu năng ổn định, dễ nâng cấp, SSD 512GB";
                case "Laptop" -> "Màn hình 15.6\", pin 8h, trọng lượng nhẹ";
                default -> "Cấu hình linh hoạt, hiệu suất cao";
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "RGB LED, hỗ trợ ATX, kính cường lực";
                case "Tản nhiệt" -> "Tản nhiệt nước 240mm, tốc độ quạt 1200RPM";
                case "PSU" -> "Công suất 650W, 80+ Gold, modular";
                case "GPU" -> "8GB GDDR6, hỗ trợ Ray Tracing, 1440p";
                case "Mainboard" -> "Hỗ trợ DDR4, PCIe 4.0, Wi-Fi 6";
                case "SSD/HDD" -> "1TB, tốc độ đọc 3500MB/s, SATA";
                case "RAM" -> "16GB DDR4, tốc độ 3200MHz, CL16";
                case "CPU" -> "8 nhân 16 luồng, xung nhịp 4.5GHz";
                default -> "Hiệu suất cao, tương thích đa dạng";
            };
            default -> "Tính năng đa dạng, phù hợp mọi nhu cầu";
        };
    }

    private String generateTechnicalSpecs(String parentName, String childName) {
        return switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Cảm biến 12MP, quay 4K 60fps, pin 1200mAh";
                case "Camera chuyên nghiệp" -> "Cảm biến 24MP, ISO 100-51200, 5-axis IBIS";
                case "Webcam" -> "1080p 30fps, USB-C, góc nhìn 90°";
                case "Camera an ninh/IP" -> "1080p, lưu trữ đám mây, hồng ngoại 30m";
                case "Camera hành trình" -> "Full HD, thẻ nhớ 64GB, G-sensor";
                default -> "Cảm biến chất lượng cao, quay video mượt mà";
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "CPU i7, GPU RTX 3060, RAM 16GB";
                case "PC đồ họa / workstation" -> "CPU Ryzen 9, 32GB RAM, SSD 1TB";
                case "Mini PC" -> "CPU i5, 8GB RAM, SSD 256GB";
                case "PC để bàn" -> "CPU i5, 16GB RAM, HDD 1TB";
                case "Laptop" -> "CPU i7, 16GB RAM, màn hình 14\" FHD";
                default -> "Cấu hình mạnh mẽ, hiệu suất ổn định";
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "Hỗ trợ ATX/micro-ATX, 3 quạt 120mm";
                case "Tản nhiệt" -> "Tản nhiệt nước, 240mm, hỗ trợ Intel/AMD";
                case "PSU" -> "650W, 80+ Gold, cáp modular";
                case "GPU" -> "8GB GDDR6, 256-bit, PCIe 4.0";
                case "Mainboard" -> "Chipset B550, DDR4, 4 khe RAM";
                case "SSD/HDD" -> "SSD 1TB, 3500MB/s, NVMe";
                case "RAM" -> "16GB DDR4, 3200MHz, non-ECC";
                case "CPU" -> "8 nhân, 16 luồng, 7nm, 65W";
                default -> "Tương thích cao, hiệu suất tốt";
            };
            default -> "Thông số kỹ thuật đa dạng, phù hợp nhu cầu";
        };
    }

    private String generateHighlightSpecs(String parentName, String childName) {
        return switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Chống nước 10m, quay 4K";
                case "Camera chuyên nghiệp" -> "Tự động lấy nét nhanh, 5-axis IBIS";
                case "Webcam" -> "1080p, plug-and-play";
                case "Camera an ninh/IP" -> "AI phát hiện chuyển động, hồng ngoại";
                case "Camera hành trình" -> "Ghi hình Full HD, GPS";
                default -> "Hình ảnh sắc nét, dễ sử dụng";
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "GPU RTX, tản nhiệt nước";
                case "PC đồ họa / workstation" -> "CPU 12 nhân, RAM 32GB";
                case "Mini PC" -> "Nhỏ gọn, tiết kiệm điện";
                case "PC để bàn" -> "Dễ nâng cấp, SSD 512GB";
                case "Laptop" -> "Pin 8h, màn hình FHD";
                default -> "Hiệu năng cao, thiết kế hiện đại";
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "RGB, kính cường lực";
                case "Tản nhiệt" -> "Hiệu suất làm mát cao";
                case "PSU" -> "80+ Gold, ổn định";
                case "GPU" -> "Ray Tracing, 1440p";
                case "Mainboard" -> "Wi-Fi 6, PCIe 4.0";
                case "SSD/HDD" -> "Tốc độ đọc/ghi cao";
                case "RAM" -> "3200MHz, hiệu suất cao";
                case "CPU" -> "Xung nhịp 4.5GHz, 8 nhân";
                default -> "Hiệu suất tối ưu, bền bỉ";
            };
            default -> "Tính năng nổi bật, đáng tin cậy";
        };
    }

    private String generatePromotions() {
        List<String> promotions = Arrays.asList(
                "Giảm 5% khi mua online",
                "Tặng kèm phụ kiện khi mua trong tuần",
                "Miễn phí vận chuyển toàn quốc",
                "Giảm 10% khi mua combo",
                "Bảo hành mở rộng 24 tháng"
        );
        return promotions.get(random.nextInt(promotions.size()));
    }
}