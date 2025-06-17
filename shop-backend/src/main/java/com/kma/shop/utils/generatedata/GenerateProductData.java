package com.kma.shop.utils.generatedata;

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
        String name = generateProductName(parent.getName(), childCategories.getFirst().getName()); // Use first child for naming
        float price = generatePrice(parent.getName());
        String description = generateDescription(parent.getName(), childCategories.getFirst().getName());
        String features = generateFeatures(parent.getName(), childCategories.getFirst().getName());
        String technicalSpecs = generateTechnicalSpecs(parent.getName(), childCategories.getFirst().getName());
        String highlightSpecs = generateHighlightSpecs(parent.getName(), childCategories.getFirst().getName());
        String promotions = generatePromotions();
        int sold = random.nextInt(500);
        int rating = random.nextInt(3) + 3; // 3-5 stars
        int stock = random.nextInt(50) + 10; // 10-59 units

        List<ProductImageEntity> productImageEntities = new ArrayList<>();
        if(parent.getName().equalsIgnoreCase("camera")){
            productImageEntities.add(buildProductImageEntity(generateCameraLink()));
            productImageEntities.add(buildProductImageEntity(generateCameraLink()));
            productImageEntities.add(buildProductImageEntity(generateCameraLink()));
        }
        else if(parent.getName().equalsIgnoreCase("máy tính")){
            productImageEntities.add(buildProductImageEntity(generateComputerLink()));
            productImageEntities.add(buildProductImageEntity(generateComputerLink()));
            productImageEntities.add(buildProductImageEntity(generateComputerLink()));
        }
        else{
            productImageEntities.add(buildProductImageEntity(generateComputerComponentLink()));
            productImageEntities.add(buildProductImageEntity(generateComputerComponentLink()));
            productImageEntities.add(buildProductImageEntity(generateComputerComponentLink()));
        }

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
        for (ProductImageEntity image : productImageEntities) {
            image.setProduct(newProduct); // Thiết lập mối quan hệ ngược
        }
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

    private String generateComputerComponentLink() {
        List<String> links = Arrays.asList(
                "https://i.pinimg.com/736x/e4/9d/1e/e49d1ecba3edd1840bd21f06a9d490bd.jpg",
                "https://i.pinimg.com/736x/c7/8a/62/c78a6279adeac77cfcce91b9f630b115.jpg",
                "https://i.pinimg.com/736x/d8/61/59/d861596e77d84dd2333181493ab928b5.jpg",
                "https://i.pinimg.com/736x/61/f3/2f/61f32fb5acb8053cb190a8ef13776bcb.jpg",
                "https://i.pinimg.com/736x/e5/c8/cc/e5c8ccb8ca0f44f83d1a954192cae95b.jpg",
                "https://i.pinimg.com/736x/a4/2e/a2/a42ea25adf6fff5411e93f49706cd8cc.jpg",
                "https://i.pinimg.com/736x/c1/49/cc/c149cc58609cb728b2913d09ed3fba8e.jpg",
                "https://i.pinimg.com/736x/26/b1/e0/26b1e064d3e10ca1fc2b482dc59a5781.jpg",
                "https://i.pinimg.com/736x/04/1d/74/041d740b3281021f6a46fc4dcbc036fb.jpg",
                "https://i.pinimg.com/736x/55/3b/f2/553bf202c42cd40d7b8bc225997c27bd.jpg",
                "https://i.pinimg.com/736x/a7/f8/71/a7f871bde9ec7e98d183ee7fe45d84b8.jpg",
                "https://i.pinimg.com/736x/d5/be/ec/d5beec7121ed55ccdecf71b59f52ec24.jpg",
                "https://i.pinimg.com/736x/d9/de/70/d9de70384cbc67fb1ad56980a6dbba64.jpg"
        );
        return links.get(random.nextInt(links.size()));
    }

    private String generateCameraLink() {
        List<String> links = Arrays.asList(
                "https://i.pinimg.com/736x/0c/90/c4/0c90c47f3a8dde3ad0044f41c74ca142.jpg",
                "https://i.pinimg.com/736x/5e/b3/bd/5eb3bdfd021b18af76f873e4c0c2cf65.jpg",
                "https://i.pinimg.com/736x/0a/97/2d/0a972d0ca32875ff20d216c17b8f6587.jpg",
                "https://i.pinimg.com/736x/57/23/56/572356f77cb0e0e7449da32255774ee0.jpg",
                "https://i.pinimg.com/736x/1b/94/fa/1b94fab3fa13d5b3b95d10c625db757c.jpg",
                "https://i.pinimg.com/736x/9f/70/09/9f70095c043895b8724c4a00f3dc59d9.jpg",
                "https://i.pinimg.com/736x/e9/94/80/e994800a695f4b1e6ffa780acf3658f5.jpg",
                "https://i.pinimg.com/736x/a3/c2/26/a3c22683af61aa14e0bfdc86978ac642.jpg",
                "https://i.pinimg.com/736x/d2/1f/d0/d21fd0cef9e152c5cea8966967d63b1e.jpg",
                "https://i.pinimg.com/736x/12/f6/c4/12f6c42bb0e65253cc6323baf3585f2a.jpg",
                "https://i.pinimg.com/736x/e2/a7/d4/e2a7d48d4a65b0064323c191da82464a.jpg",
                "https://i.pinimg.com/736x/26/e6/1c/26e61ccd14becf2e9fc0a39e420b89fd.jpg"
        );
        return links.get(random.nextInt(links.size()));
    }

    private String generateComputerLink() {
        List<String> links = Arrays.asList(
                "https://i.pinimg.com/736x/af/b0/4d/afb04de7b01f843c45abbc9ee08dc58e.jpg",
                "https://i.pinimg.com/736x/55/64/48/5564485f2f78ecbff2374b9ebeadeb4a.jpg",
                "https://i.pinimg.com/736x/b6/14/28/b614286ef52de836895c9855796e3e84.jpg",
                "https://i.pinimg.com/736x/0a/4c/fc/0a4cfca4a2b7650effb12444f5b7b8f4.jpg",
                "https://i.pinimg.com/736x/5c/82/1e/5c821e55c5fa0f73f6194a1416a8ccbd.jpg",
                "https://i.pinimg.com/736x/e2/5b/8c/e25b8cc2108e29e17e9deeebc31242a3.jpg",
                "https://i.pinimg.com/736x/c2/56/29/c2562961b1e81fc60e748f9f0f2f0769.jpg",
                "https://i.pinimg.com/736x/81/42/a5/8142a59c8128ab47a838d81a03aedf71.jpg",
                "https://i.pinimg.com/736x/94/ce/4e/94ce4ed0f49d59f829cfb3195b6403a9.jpg",
                "https://i.pinimg.com/736x/28/91/eb/2891ebd512688a0dd1b056a1375c3367.jpg",
                "https://i.pinimg.com/736x/8c/30/3d/8c303de9ece18fb1de2d91879306f988.jpg",
                "https://i.pinimg.com/736x/29/f3/99/29f399aec2699d49113314f1e96d5063.jpg",
                "https://unsplash.com/photos/macbook-pro-JO_S6ewBqAk",
                "https://unsplash.com/photos/person-using-black-laptop-computer-on-brown-wooden-table-8pb7Hq539Zw",
                "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-table-6RqSDGaNJ5c"
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