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
import java.util.Map;

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
        if (productServiceV2.count() < 1) {
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
        int numberOfProducts = random.nextInt(3) + 50; // Generate 3-5 products for this parent's ecosystem
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
        // Realistic brand names for different categories
        Map<String, List<String>> categoryBrands = Map.of(
            "Camera", Arrays.asList("Canon", "Sony", "Nikon", "GoPro", "Panasonic", "Fujifilm", "Hikvision", "Dahua", "Logitech", "Razer"),
            "Máy tính", Arrays.asList("Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Apple", "Gigabyte", "Samsung", "LG"),
            "Linh kiện", Arrays.asList("Intel", "AMD", "NVIDIA", "Corsair", "Kingston", "G.Skill", "ASRock", "Gigabyte", "Cooler Master", "NZXT", "Seagate", "Western Digital")
        );

        // Model series for different categories
        Map<String, List<String>> categoryModels = Map.of(
            "Camera", Arrays.asList("EOS", "Alpha", "D", "Hero", "Lumix", "X-T", "DS-2CD", "IPC", "C920", "Kiyo"),
            "Máy tính", Arrays.asList("Inspiron", "Pavilion", "ThinkPad", "VivoBook", "Aspire", "GE", "MacBook", "AORUS", "Galaxy", "Gram"),
            "Linh kiện", Arrays.asList("Core i", "Ryzen", "GeForce", "Vengeance", "HyperX", "Ripjaws", "B", "AORUS", "Hyper", "H510", "Barracuda", "Blue")
        );

        List<String> brands = categoryBrands.getOrDefault(parentName, Arrays.asList("Tech", "Pro", "Elite"));
        List<String> models = categoryModels.getOrDefault(parentName, Arrays.asList("Series", "Pro", "Elite"));

        String brand = brands.get(random.nextInt(brands.size()));
        String model = models.get(random.nextInt(models.size()));
        
        // Generate realistic model numbers based on category and child category
        String modelNumber = generateModelNumber(parentName, childName);
        
        return brand + " " + model + " " + modelNumber;
    }

    private String generateModelNumber(String parentName, String childName) {
        return switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Hero" + (random.nextInt(10) + 8); // Hero 8-17
                case "Camera chuyên nghiệp" -> "EOS R" + (random.nextInt(5) + 5); // EOS R5-R10
                case "Webcam" -> "C" + (random.nextInt(900) + 100); // C100-C999
                case "Camera an ninh/IP" -> "DS-2CD" + (random.nextInt(2000) + 1000); // DS-2CD1000-2999
                case "Camera hành trình" -> "Dash" + (random.nextInt(5) + 1); // Dash 1-5
                default -> "Cam" + (random.nextInt(100) + 1); // Cam 1-100
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "GE" + (random.nextInt(70) + 60); // GE60-GE129
                case "PC đồ họa / workstation" -> "Precision" + (random.nextInt(5000) + 3000); // Precision3000-7999
                case "Mini PC" -> "NUC" + (random.nextInt(10) + 10); // NUC10-NUC19
                case "PC để bàn" -> "Inspiron" + (random.nextInt(5000) + 3000); // Inspiron3000-7999
                case "Laptop" -> switch (random.nextInt(3)) {
                    case 0 -> "ThinkPad T" + (random.nextInt(10) + 14); // ThinkPad T14-T23
                    case 1 -> "MacBook " + (random.nextBoolean() ? "Air" : "Pro");
                    case 2 -> "VivoBook S" + (random.nextInt(10) + 14); // VivoBook S14-S23
                    default -> "Laptop" + (random.nextInt(100) + 1);
                };
                default -> "PC" + (random.nextInt(100) + 1); // PC 1-100
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "H" + (random.nextInt(500) + 100); // H100-H599
                case "Tản nhiệt" -> "Hyper" + (random.nextInt(200) + 100); // Hyper100-Hyper299
                case "PSU" -> "RM" + (random.nextInt(800) + 200); // RM200-RM999
                case "GPU" -> "RTX " + (random.nextInt(4000) + 3000); // RTX 3000-6999
                case "Mainboard" -> "B" + (random.nextInt(600) + 400) + "M"; // B400M-B999M
                case "SSD/HDD" -> random.nextBoolean() ? 
                    "SSD" + (random.nextInt(1000) + 500) : // SSD500-SSD1499
                    "WD" + (random.nextInt(1000) + 1000); // WD1000-WD1999
                case "RAM" -> (random.nextInt(32) + 8) + "GB"; // 8GB-39GB
                case "CPU" -> switch (random.nextInt(2)) {
                    case 0 -> "i" + (random.nextInt(5) + 5) + "-" + (random.nextInt(1000) + 1000); // i5-1000 to i9-1999
                    case 1 -> "Ryzen " + (random.nextInt(5) + 5) + " " + (random.nextInt(1000) + 1000); // Ryzen 5 1000 to Ryzen 9 1999
                    default -> "CPU" + (random.nextInt(100) + 1);
                };
                default -> "Comp" + (random.nextInt(100) + 1); // Comp 1-100
            };
            default -> "Product" + (random.nextInt(1000) + 1); // Product 1-1000
        };
    }

    private float generatePrice(String parentName) {
        return switch (parentName) {
            case "Camera" -> generateCameraPrice();
            case "Máy tính" -> generateComputerPrice();
            case "Linh kiện" -> generateComponentPrice();
            default -> 1000000 + random.nextFloat() * 10000000; // 1M - 11M VND
        };
    }

    private float generateCameraPrice() {
        // Camera prices vary significantly by type
        int type = random.nextInt(5);
        return switch (type) {
            case 0 -> 1500000 + random.nextFloat() * 3500000; // Webcam: 1.5M - 5M VND
            case 1 -> 3000000 + random.nextFloat() * 7000000; // Action camera: 3M - 10M VND
            case 2 -> 8000000 + random.nextFloat() * 12000000; // Security camera: 8M - 20M VND
            case 3 -> 15000000 + random.nextFloat() * 25000000; // Professional camera: 15M - 40M VND
            case 4 -> 5000000 + random.nextFloat() * 8000000; // Dash cam: 5M - 13M VND
            default -> 2000000 + random.nextFloat() * 5000000; // General camera: 2M - 7M VND
        };
    }

    private float generateComputerPrice() {
        // Computer prices vary by type
        int type = random.nextInt(5);
        return switch (type) {
            case 0 -> 8000000 + random.nextFloat() * 12000000; // Mini PC: 8M - 20M VND
            case 1 -> 12000000 + random.nextFloat() * 18000000; // Desktop PC: 12M - 30M VND
            case 2 -> 15000000 + random.nextFloat() * 25000000; // Laptop: 15M - 40M VND
            case 3 -> 25000000 + random.nextFloat() * 35000000; // Gaming PC: 25M - 60M VND
            case 4 -> 30000000 + random.nextFloat() * 50000000; // Workstation: 30M - 80M VND
            default -> 15000000 + random.nextFloat() * 20000000; // General computer: 15M - 35M VND
        };
    }

    private float generateComponentPrice() {
        // Component prices vary significantly by type
        int type = random.nextInt(8);
        return switch (type) {
            case 0 -> 800000 + random.nextFloat() * 1200000; // Case: 800K - 2M VND
            case 1 -> 500000 + random.nextFloat() * 1500000; // Cooling: 500K - 2M VND
            case 2 -> 1500000 + random.nextFloat() * 3000000; // PSU: 1.5M - 4.5M VND
            case 3 -> 8000000 + random.nextFloat() * 15000000; // GPU: 8M - 23M VND
            case 4 -> 2000000 + random.nextFloat() * 4000000; // Mainboard: 2M - 6M VND
            case 5 -> 1000000 + random.nextFloat() * 3000000; // Storage: 1M - 4M VND
            case 6 -> 1500000 + random.nextFloat() * 4000000; // RAM: 1.5M - 5.5M VND
            case 7 -> 3000000 + random.nextFloat() * 8000000; // CPU: 3M - 11M VND
            default -> 1000000 + random.nextFloat() * 2000000; // General component: 1M - 3M VND
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
                "https://i.pinimg.com/736x/29/f3/99/29f399aec2699d49113314f1e96d5063.jpg"
                );
        return links.get(random.nextInt(links.size()));
    }


        public String generateDescription(String parentName, String childName) {
            String baseDescription;

            switch (parentName) {
                case "Camera":
                    switch (childName) {
                        case "Camera hành động":
                            baseDescription = "Với thiết kế chắc chắn và khả năng chống chịu mọi điều kiện, đây là lựa chọn hoàn hảo để ghi lại mọi khoảnh khắc phiêu lưu của bạn ở chất lượng 4K đỉnh cao. Tích hợp nhiều tính năng thông minh giúp bạn dễ dàng sáng tạo nội dung độc đáo.";
                            break;
                        case "Camera chuyên nghiệp":
                            baseDescription = "Dành cho những nhà sáng tạo nội dung và nhiếp ảnh gia chuyên nghiệp, chiếc camera này mang đến hiệu suất vượt trội với cảm biến lớn, khả năng lấy nét cực nhanh và dải ISO rộng, đảm bảo hình ảnh sắc nét và chi tiết ngay cả trong điều kiện ánh sáng khó khăn. Tối ưu hóa cho cả chụp ảnh và quay video chất lượng cao.";
                            break;
                        case "Webcam":
                            baseDescription = "Mang lại chất lượng hình ảnh và âm thanh rõ nét cho mọi cuộc gọi video và livestream. Với độ phân giải cao và micro tích hợp, bạn sẽ luôn xuất hiện chuyên nghiệp và rõ ràng. Thiết kế nhỏ gọn, dễ dàng lắp đặt và sử dụng ngay lập tức.";
                            break;
                        case "Camera an ninh/IP":
                            baseDescription = "Giải pháp giám sát thông minh cho ngôi nhà hoặc doanh nghiệp của bạn. Camera cung cấp hình ảnh Full HD sắc nét ngày lẫn đêm nhờ hồng ngoại, cùng với khả năng phát hiện chuyển động bằng AI và kết nối từ xa qua Wi-Fi, giúp bạn an tâm mọi lúc mọi nơi.";
                            break;
                        case "Camera hành trình":
                            baseDescription = "Người bạn đồng hành không thể thiếu trên mọi cung đường. Camera ghi lại hành trình của bạn với độ phân giải Full HD, tích hợp GPS và cảm biến G để lưu trữ bằng chứng quan trọng khi cần. Đảm bảo an toàn và minh bạch cho mọi chuyến đi.";
                            break;
                        default:
                            baseDescription = "Dòng sản phẩm camera chất lượng cao, dễ sử dụng, mang lại những thước phim và hình ảnh sống động, chân thực.";
                            break;
                    }
                    break;
                case "Máy tính":
                    switch (childName) {
                        case "PC gaming":
                            baseDescription = "Đắm chìm vào thế giới game với hiệu năng đỉnh cao. Chiếc PC này được trang bị card đồ họa mạnh mẽ, bộ xử lý tiên tiến và hệ thống tản nhiệt tối ưu, đảm bảo trải nghiệm chơi game mượt mà, không giật lag ngay cả với các tựa game đồ họa nặng nhất. Thiết kế hầm hố, phong cách.";
                            break;
                        case "PC đồ họa / workstation":
                            baseDescription = "Sức mạnh vượt trội cho các tác vụ đòi hỏi hiệu năng cao như thiết kế đồ họa, dựng phim 3D, hoặc phân tích dữ liệu. Với CPU đa nhân, dung lượng RAM lớn và ổ cứng tốc độ cao, máy tính này là công cụ lý tưởng cho các chuyên gia sáng tạo và kỹ thuật.";
                            break;
                        case "Mini PC":
                            baseDescription = "Giải pháp máy tính nhỏ gọn nhưng mạnh mẽ, lý tưởng cho không gian làm việc hạn chế hoặc làm trung tâm giải trí đa phương tiện. Tiết kiệm điện năng, vận hành êm ái nhưng vẫn đảm bảo hiệu suất ổn định cho công việc và giải trí hàng ngày.";
                            break;
                        case "PC để bàn":
                            baseDescription = "Cấu hình linh hoạt, dễ dàng nâng cấp và phù hợp với nhiều nhu cầu sử dụng từ văn phòng đến giải trí gia đình. Với hiệu suất ổn định và khả năng tùy biến cao, đây là lựa chọn đáng tin cậy cho mọi người dùng.";
                            break;
                        case "Laptop":
                            baseDescription = "Sự kết hợp hoàn hảo giữa hiệu suất và tính di động. Chiếc laptop này cung cấp đủ sức mạnh để xử lý công việc, học tập và giải trí mọi lúc mọi nơi, với thời lượng pin dài và thiết kế mỏng nhẹ, tiện lợi mang theo.";
                            break;
                        default:
                            baseDescription = "Các dòng máy tính đa dạng, mang lại hiệu suất mạnh mẽ và ổn định, phù hợp với mọi đối tượng người dùng từ cá nhân đến doanh nghiệp.";
                            break;
                    }
                    break;
                case "Linh kiện":
                    switch (childName) {
                        case "Case":
                            baseDescription = "Bảo vệ các linh kiện bên trong và thể hiện cá tính riêng của bạn. Vỏ case được thiết kế với luồng không khí tối ưu, hỗ trợ nhiều kích thước linh kiện và thường đi kèm với đèn RGB bắt mắt cùng tấm kính cường lực sang trọng để bạn tự tin trưng bày bộ máy.";
                            break;
                        case "Tản nhiệt":
                            baseDescription = "Đảm bảo CPU của bạn luôn hoạt động ở nhiệt độ lý tưởng, ngay cả dưới tải nặng. Các giải pháp tản nhiệt từ khí đến nước giúp kéo dài tuổi thọ linh kiện và duy trì hiệu suất tối đa cho hệ thống của bạn.";
                            break;
                        case "PSU":
                            baseDescription = "Cung cấp nguồn điện ổn định và đáng tin cậy cho toàn bộ hệ thống. Với hiệu suất cao và thiết kế mô-đun, PSU giúp tối ưu hóa việc sử dụng năng lượng và quản lý cáp gọn gàng, bảo vệ các linh kiện quý giá của bạn.";
                            break;
                        case "GPU":
                            baseDescription = "Nâng tầm trải nghiệm hình ảnh của bạn lên một đẳng cấp mới. Card đồ họa này mang lại hiệu suất chơi game mượt mà ở độ phân giải cao, hỗ trợ công nghệ dò tia (Ray Tracing) tiên tiến cho đồ họa siêu thực và khả năng xử lý mạnh mẽ cho các ứng dụng sáng tạo.";
                            break;
                        case "Mainboard":
                            baseDescription = "Nền tảng kết nối mọi linh kiện trong hệ thống, đảm bảo sự tương thích và hiệu suất tối ưu. Bo mạch chủ này hỗ trợ các công nghệ mới nhất về RAM, PCIe và kết nối không dây, cung cấp nền tảng vững chắc cho bất kỳ cấu hình PC nào.";
                            break;
                        case "SSD/HDD":
                            baseDescription = "Giải pháp lưu trữ tốc độ cao và dung lượng lớn cho mọi nhu cầu. SSD mang lại tốc độ khởi động hệ điều hành và tải ứng dụng nhanh chóng, trong khi HDD cung cấp không gian rộng rãi để lưu trữ dữ liệu lớn với chi phí hiệu quả.";
                            break;
                        case "RAM":
                            baseDescription = "Nâng cao khả năng đa nhiệm và tốc độ xử lý của máy tính. Với dung lượng và tốc độ cao, RAM giúp các ứng dụng chạy mượt mà hơn, giảm độ trễ và cải thiện hiệu suất tổng thể, đặc biệt quan trọng cho game thủ và người dùng chuyên nghiệp.";
                            break;
                        case "CPU":
                            baseDescription = "Bộ não của máy tính, quyết định tốc độ và khả năng xử lý của hệ thống. CPU này cung cấp hiệu suất mạnh mẽ cho mọi tác vụ, từ làm việc văn phòng, giải trí đến chơi game và xử lý đồ họa chuyên sâu, với số nhân và luồng được tối ưu.";
                            break;
                        default:
                            baseDescription = "Các linh kiện máy tính chất lượng cao, đảm bảo hiệu suất tối ưu và khả năng tương thích rộng rãi, là nền tảng vững chắc cho mọi cấu hình PC.";
                            break;
                    }
                    break;
                default:
                    baseDescription = "Sản phẩm đa dạng, chất lượng cao, đáp ứng mọi nhu cầu và mang lại trải nghiệm sử dụng tuyệt vời.";
                    break;
            }

            return baseDescription + " Đây là mô tả dành cho **" + childName + "** trong danh mục **" + parentName + "**.";
        }

        public String generateFeatures(String parentName, String childName) {
            return switch (parentName) {
                case "Camera" -> switch (childName) {
                    case "Camera hành động" -> "Những chiếc camera này được chế tạo để phục vụ những cuộc phiêu lưu! Các tính năng chính bao gồm khả năng chống nước mạnh mẽ, thường cho phép ngâm dưới nước đến 10 mét (hoặc hơn với vỏ bảo vệ bổ sung). Chúng xuất sắc trong việc quay video 4K ở tốc độ khung hình cao (như 60fps hoặc thậm chí 120fps) cho cảnh quay chuyển động chậm mượt mà, và thường cung cấp góc nhìn siêu rộng 170° để ghi lại những cảnh quan bao la. Nhiều loại cũng bao gồm tính năng ổn định hình ảnh tiên tiến (điện tử hoặc quang học) để đảm bảo cảnh quay ổn định ngay cả trong các hoạt động cường độ cao, và điều khiển bằng giọng nói để vận hành rảnh tay.";
                    case "Camera chuyên nghiệp" -> "Được thiết kế cho các nhiếp ảnh gia và nhà quay phim nghiêm túc, những chiếc máy này tự hào với cảm biến Full-frame hoặc APS-C lớn cho hiệu suất ánh sáng yếu vượt trội và độ sâu trường ảnh nông. Chúng cung cấp dải ISO rộng lớn (ví dụ: 100-51200) cho tính linh hoạt trong các điều kiện ánh sáng khác nhau, và chụp liên tục tốc độ cao (ví dụ: 10fps trở lên) để ghi lại các đối tượng chuyển động nhanh. Hãy mong đợi các tính năng như hệ thống lấy nét tự động tiên tiến với khả năng theo dõi, ổn định hình ảnh trong thân máy (IBIS), và các định dạng quay video chuyên nghiệp (như hồ sơ LOG) để linh hoạt hậu kỳ rộng rãi.";
                    case "Webcam" -> "Thiết yếu cho các cuộc gọi video và phát trực tiếp, webcam hiện đại chủ yếu cung cấp độ phân giải 1080p (Full HD) hoặc thậm chí 4K cho hình ảnh sắc nét. Chúng hầu như luôn bao gồm micrô tích hợp với khả năng giảm tiếng ồn cho âm thanh rõ ràng và tự động lấy nét để giữ bạn luôn sắc nét. Nhiều loại cũng có tính năng tự động điều chỉnh ánh sáng để thích ứng với các môi trường ánh sáng khác nhau, và ống kính góc rộng để bao gồm nhiều không gian xung quanh bạn hơn.";
                    case "Camera an ninh/IP" -> "Những chiếc camera này tập trung vào việc giám sát mọi thứ. Chúng có tính năng nhìn đêm hồng ngoại (IR) cho cảnh quay rõ ràng trong bóng tối hoàn toàn, kết nối Wi-Fi để giám sát từ xa qua ứng dụng điện thoại thông minh, và phát hiện chuyển động được hỗ trợ bởi AI có thể phân biệt giữa người, vật nuôi và phương tiện. Các mẫu nâng cao cung cấp âm thanh hai chiều, tùy chọn lưu trữ đám mây, lưu trữ cục bộ (thẻ SD), và các vùng cảnh báo có thể tùy chỉnh.";
                    case "Camera hành trình" -> "Quan trọng đối với người lái xe, những chiếc camera này tập trung vào việc ghi hình độ phân giải Full HD (1080p) hoặc cao hơn cho hành trình của bạn. Chúng thường có GPS tích hợp để ghi lại tốc độ và vị trí, góc nhìn rộng 140° (hoặc rộng hơn), và cảm biến G tự động khóa cảnh quay khi va chạm. Ghi hình vòng lặp, giám sát đỗ xe, và Wi-Fi để dễ dàng truyền tệp cũng là những tính năng phổ biến.";
                    default -> "Nói chung, cung cấp chất lượng hình ảnh cao với giao diện thân thiện với người dùng, giúp chúng dễ tiếp cận để sử dụng hàng ngày.";
                };
                case "Máy tính" -> switch (childName) {
                    case "PC gaming" -> "Những cỗ máy này được thiết kế để đạt hiệu suất chơi game cao nhất. Chúng có các đơn vị GPU chuyên dụng mạnh mẽ như dòng NVIDIA GeForce RTX cho hình ảnh tuyệt đẹp và dò tia, dung lượng RAM tốc độ cao dồi dào 16GB (hoặc hơn) để đa nhiệm mượt mà, và thường là hệ thống tản nhiệt nước tiên tiến (AIO hoặc vòng lặp tùy chỉnh) để duy trì nhiệt độ tối ưu trong các phiên chơi game cường độ cao. Hỗ trợ màn hình tần số quét cao, đèn RGB tùy chỉnh, và lưu trữ SSD nhanh cũng phổ biến.";
                    case "PC đồ họa / workstation" -> "Được xây dựng cho các tác vụ sáng tạo và chuyên nghiệp đòi hỏi khắt khe. Chúng thường chứa các CPU đa nhân với 12 nhân trở lên (ví dụ: Intel i9, AMD Ryzen 9, Threadripper) cho việc dựng hình nặng và tính toán phức tạp. Chúng được trang bị RAM ECC 32GB (hoặc hơn) đáng kể cho sự ổn định và sửa lỗi, và SSD NVMe 1TB (hoặc lớn hơn) cực nhanh để truy cập tệp và tải ứng dụng nhanh chóng. Các GPU chuyên nghiệp (NVIDIA Quadro, AMD Radeon Pro) và bộ nguồn mạnh mẽ cũng là tiêu chuẩn.";
                    case "Mini PC" -> "Ưu tiên thiết kế tiết kiệm không gian, chúng cực kỳ nhỏ gọn và tiết kiệm năng lượng, làm cho chúng lý tưởng cho các thiết lập tối giản hoặc HTPC.";
                    case "PC để bàn" -> "Lựa chọn cổ điển cho điện toán nói chung, mang lại hiệu suất ổn định và khả năng nâng cấp tuyệt vời. Chúng thường bao gồm một ổ SSD 512GB cho hệ điều hành và các ứng dụng thường dùng, thường được ghép nối với một ổ HDD lớn hơn để lưu trữ dữ liệu lớn. Thiết kế mô-đun của chúng cho phép dễ dàng thay thế và thêm các thành phần, làm cho chúng trở thành một lựa chọn linh hoạt cho nhiều người dùng.";
                    case "Laptop" -> "Nhấn mạnh tính di động và chức năng tích hợp. Các tính năng phổ biến bao gồm màn hình Full HD 15.6 inch cho sự cân bằng giữa không gian màn hình và tính di động, pin lâu dài (ví dụ: 8 giờ trở lên) cho năng suất khi di chuyển, và thiết kế nhẹ (thường dưới 2kg) để dễ dàng vận chuyển. Chúng thường tích hợp webcam, micrô và Wi-Fi cho khả năng kết nối toàn diện.";
                    default -> "Nói chung, cung cấp cấu hình linh hoạt để đáp ứng nhiều nhu cầu người dùng khác nhau và mang lại hiệu suất tổng thể cao cho các tác vụ điện toán nói chung.";
                };
                case "Linh kiện" -> switch (childName) {
                    case "Case" -> "Không chỉ là một vỏ bọc, các vỏ máy tính hiện đại thường có đèn LED RGB sống động để tùy chỉnh thẩm mỹ, hỗ trợ nhiều dạng bo mạch chủ bao gồm ATX, Micro-ATX và Mini-ITX, và thường tích hợp các tấm kính cường lực bên hông để khoe các thành phần bên trong. Chúng cũng tập trung vào việc tối ưu hóa luồng không khí và các giải pháp quản lý cáp.";
                    case "Tản nhiệt" -> "Quan trọng để duy trì nhiệt độ CPU tối ưu, các giải pháp tản nhiệt tiên tiến bao gồm bộ làm mát chất lỏng 240mm hoặc lớn hơn (AIO) để tản nhiệt vượt trội, và thường tự hào với tốc độ quạt 1200 RPM (hoặc cao hơn) cho luồng không khí hiệu quả với tiếng ồn tối thiểu. Chúng hỗ trợ nhiều loại ổ cắm CPU (Intel LGA, AMD AM) và thường bao gồm đèn RGB tùy chỉnh.";
                    case "PSU" -> "Trái tim của hệ thống của bạn, một bộ nguồn tốt cung cấp năng lượng ổn định. Các tính năng bao gồm công suất đầu ra cao 650W (hoặc hơn) để hỗ trợ các thành phần mạnh mẽ, xếp hạng hiệu suất 80+ Gold (hoặc cao hơn) để giảm lãng phí năng lượng và nhiệt, và thiết kế mô-đun cho phép người dùng chỉ kết nối các cáp cần thiết, cải thiện luồng không khí và tính thẩm mỹ.";
                    case "GPU" -> "Động cơ xử lý hình ảnh, các GPU hiện đại đi kèm với 8GB (hoặc hơn) bộ nhớ video GDDR6 (hoặc GDDR6X), cung cấp các tính năng tiên tiến như dò tia (Ray Tracing) cho ánh sáng và bóng đổ chân thực, và được tối ưu hóa cho chơi game 1440p (2K) hoặc 4K. Chúng cũng hỗ trợ nhiều đầu ra hiển thị và các giải pháp tản nhiệt tiên tiến.";
                    case "Mainboard" -> "Xương sống kết nối tất cả các thành phần. Các tính năng chính bao gồm hỗ trợ RAM DDR4 (hoặc DDR5), các khe cắm PCIe 4.0 (hoặc 5.0) cho GPU và SSD NVMe tốc độ cao, và Wi-Fi 6 (hoặc 6E) tích hợp cho mạng không dây nhanh, đáng tin cậy. Chúng cũng cung cấp nhiều khe cắm M.2, cổng USB 3.2 và VRM mạnh mẽ để cung cấp năng lượng ổn định cho CPU.";
                    case "SSD/HDD" -> "SSD NVMe M.2 1TB với tốc độ đọc tuần tự lên đến 3500MB/s và tốc độ ghi lên đến 3000MB/s. Đối với HDD, thường có dung lượng 1TB với tốc độ trục quay 7200 RPM và giao diện SATA 6Gb/s.";
                    case "RAM" -> "Bộ kit DDR4 16GB (2x8GB), chạy ở tần số 3200MHz, với độ trễ CAS (CL) là 16, và non-ECC unbuffered.";
                    case "CPU" -> "8 nhân và 16 luồng, được xây dựng trên tiến trình 7nm (hoặc 10nm/Intel 7), với xung nhịp cơ bản 3.8GHz và xung nhịp tăng cường lên đến 4.5GHz, và TDP 65W.";
                    default -> "Nói chung, cung cấp khả năng tương thích cao trên nhiều hệ thống khác nhau và mang lại hiệu suất ổn định cho danh mục của nó.";
                };
                default -> "Tính năng đa dạng, phù hợp mọi nhu cầu và mang lại trải nghiệm người dùng tối ưu.";
            };
        }

    public String generateTechnicalSpecs(String parentName, String childName) {
        return switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Thường được trang bị cảm biến hình ảnh 12MP đến 20MP, có khả năng quay video 4K ở 60fps (hoặc cao hơn), và dung lượng pin khoảng 1200mAh đến 1700mAh để sử dụng kéo dài. Khả năng kết nối thường bao gồm Wi-Fi, Bluetooth và USB-C.";
                case "Camera chuyên nghiệp" -> "Có cảm biến Full-frame hoặc APS-C 24MP đến 60MP, dải ISO rộng từ 100-51200 (có thể mở rộng lên đến 204800), và thường là ổn định hình ảnh trong thân máy 5 trục (IBIS) cung cấp đến 7 stop bù trừ. Chúng hỗ trợ nhiều loại ngàm ống kính (ví dụ: ngàm E, ngàm RF) và cung cấp các codec video chuyên nghiệp như H.264, H.265 và đầu ra video RAW.";
                case "Webcam" -> "Cung cấp độ phân giải 1080p ở 30fps (hoặc 60fps cho các mẫu cao cấp hơn), kết nối qua USB-C hoặc USB-A, và có góc nhìn điển hình từ 78° đến 90°. Một số mẫu bao gồm micrô đa hướng kép với khả năng khử tiếng ồn.";
                case "Camera an ninh/IP" -> "Ghi hình ở độ phân giải 1080p đến 4K, thường đi kèm với các tùy chọn đăng ký lưu trữ đám mây và hỗ trợ lưu trữ cục bộ qua thẻ nhớ microSD (lên đến 256GB). Phạm vi nhìn đêm hồng ngoại thường mở rộng từ 10m đến 30m.";
                case "Camera hành trình" -> "Ghi hình ở độ phân giải Full HD 1080p ở 30fps hoặc 60fps, hỗ trợ thẻ nhớ microSD lên đến 64GB hoặc 128GB, và tích hợp cảm biến G với độ nhạy có thể điều chỉnh. Một số mẫu có màn hình tích hợp để phát lại ngay lập tức.";
                default -> "Nói chung, bao gồm cảm biến chất lượng cao (ví dụ: 20MP) và khả năng quay video mượt mà (ví dụ: 1080p 60fps).";
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "Thường có CPU Intel Core i7 hoặc AMD Ryzen 7, GPU NVIDIA GeForce RTX 3060 (hoặc cao hơn) chuyên dụng, và 16GB RAM DDR4 (hoặc DDR5) chạy ở tốc độ 3200MHz hoặc cao hơn. Lưu trữ thường bao gồm SSD NVMe 500GB-1TB cho game và hệ điều hành, cùng với một ổ HDD lớn hơn cho dữ liệu khác.";
                case "PC đồ họa / workstation" -> "Được trang bị CPU AMD Ryzen 9 hoặc Intel Core i9/Xeon, đi kèm với 32GB đến 64GB RAM DDR4 ECC, và ít nhất 1TB SSD NVMe cho lưu trữ chính, thường được bổ sung bằng nhiều ổ HDD lớn hoặc SSD bổ sung. Các GPU chuyên nghiệp như NVIDIA Quadro hoặc AMD Radeon Pro là tiêu chuẩn.";
                case "Mini PC" -> "Thường được trang bị CPU Intel Core i5 hoặc AMD Ryzen 5 tiết kiệm điện, 8GB RAM DDR4 và SSD NVMe 256GB. Khả năng kết nối thường bao gồm nhiều cổng USB 3.0, HDMI, DisplayPort và Gigabit Ethernet.";
                case "PC để bàn" -> "Nói chung, bao gồm CPU Intel Core i5 hoặc AMD Ryzen 5, 16GB RAM DDR4 và cấu hình lưu trữ 1TB HDD kết hợp với SSD 256GB. Các cổng I/O tiêu chuẩn phổ biến và các khe mở rộng để nâng cấp trong tương lai luôn có sẵn.";
                case "Laptop" -> "Thường có CPU Intel Core i7 hoặc AMD Ryzen 7, 16GB RAM DDR4 và màn hình IPS Full HD (1920x1080) 14 inch hoặc 15.6 inch. Lưu trữ thường là SSD NVMe 512GB hoặc 1TB. Tuổi thọ pin trung bình khoảng 8-10 giờ khi sử dụng bình thường.";
                default -> "Nói chung, cung cấp cấu hình mạnh mẽ phù hợp với nhiều ứng dụng, đảm bảo hiệu suất ổn định và đáng tin cậy.";
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "Hỗ trợ các dạng bo mạch chủ ATX, Micro-ATX và Mini-ITX, thường bao gồm 3 quạt 120mm được cài đặt sẵn (hoặc hơn), và có kích thước phù hợp với nhiều kích thước thành phần. Vật liệu thường là thép với các tấm kính cường lực.";
                case "Tản nhiệt" -> "Tản nhiệt nước AIO 240mm với bộ tản nhiệt bằng nhôm, hỗ trợ các ổ cắm Intel LGA1700/1200/115x và AMD AM5/AM4, và có quạt điều khiển PWM với tốc độ từ 800-2000 RPM.";
                case "PSU" -> "Công suất đầu ra liên tục 650W, hiệu suất được chứng nhận 80+ Gold (thường là 90% hiệu suất ở 50% tải), thiết kế cáp hoàn toàn mô-đun, và các tính năng bảo vệ khác nhau như OVP, OPP, SCP.";
                case "GPU" -> "8GB GDDR6 VRAM với giao diện bộ nhớ 256-bit, hỗ trợ PCIe 4.0 x16, có tốc độ xung nhịp tăng cường khoảng 1700-1800 MHz, và có mức tiêu thụ điện năng khoảng 170-220W.";
                case "Mainboard" -> "Có chipset AMD B550 (hoặc Intel Z690/B660), 4 khe cắm DDR4 DIMM hỗ trợ lên đến 128GB RAM, khe cắm PCIe 4.0 x16, nhiều khe cắm M.2 NVMe (PCIe 4.0 x4), và Wi-Fi 6 tích hợp.";
                case "SSD/HDD" -> "SSD NVMe M.2 1TB với tốc độ đọc tuần tự lên đến 3500MB/s và tốc độ ghi lên đến 3000MB/s. Đối với HDD, thường có dung lượng 1TB với tốc độ trục quay 7200 RPM và giao diện SATA 6Gb/s.";
                case "RAM" -> "Bộ kit DDR4 16GB (2x8GB), chạy ở tần số 3200MHz, với độ trễ CAS (CL) là 16, và non-ECC unbuffered.";
                case "CPU" -> "8 nhân và 16 luồng, được xây dựng trên tiến trình 7nm (hoặc 10nm/Intel 7), với xung nhịp cơ bản 3.8GHz và xung nhịp tăng cường lên đến 4.5GHz, và TDP 65W.";
                default -> "Nói chung, cung cấp khả năng tương thích cao trên nhiều hệ thống khác nhau và mang lại hiệu suất ổn định cho danh mục của nó.";
            };
            default -> "Thông số kỹ thuật đa dạng, phù hợp mọi nhu cầu và được tối ưu hóa cho hiệu suất cao.";
        };
    }

    public String generateHighlightSpecs(String parentName, String childName) {
        return switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Điểm bán hàng chính là khả năng **chống nước 10m+** (thường không cần vỏ) và khả năng **quay video 4K tuyệt đẹp**, làm cho chúng hoàn hảo cho các môn thể thao mạo hiểm và du lịch.";
                case "Camera chuyên nghiệp" -> "Điểm mạnh của chúng là khả năng **lấy nét tự động cực nhanh** để đạt được độ sắc nét quan trọng và **ổn định hình ảnh trong thân máy 5 trục (IBIS)** cho những bức ảnh cực kỳ ổn định, ngay cả khi chụp cầm tay.";
                case "Webcam" -> "Sự đơn giản của **video 1080p** kết hợp với **thiết lập cắm-và-chạy** đảm bảo trải nghiệm không rắc rối cho các cuộc họp ảo.";
                case "Camera an ninh/IP" -> "Khả năng **phát hiện chuyển động AI thông minh** và **tầm nhìn hồng ngoại ban đêm mạnh mẽ** là yếu tố quan trọng để giám sát hiệu quả, mang lại sự an tâm ngày đêm.";
                case "Camera hành trình" -> "Khả năng quay **video Full HD** làm bằng chứng cho các chuyến đi của bạn và **theo dõi GPS tích hợp** cho dữ liệu vị trí và tốc độ là vô giá cho an toàn và bảo hiểm.";
                default -> "Tập trung vào việc cung cấp **hình ảnh sắc nét, rõ ràng** với **thao tác đơn giản**, giúp nó dễ tiếp cận cho mọi người.";
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "Sức hấp dẫn cốt lõi nằm ở **GPU RTX mạnh mẽ** cho đồ họa sống động và hệ thống **tản nhiệt nước hiệu quả** đảm bảo hiệu suất ổn định trong các phiên chơi game cường độ cao.";
                case "PC đồ họa / workstation" -> "Điểm mạnh của nó là **CPU 12+ nhân** cho sức mạnh xử lý vượt trội và **dung lượng RAM 32GB khổng lồ** để xử lý các tệp và ứng dụng lớn, phức tạp.";
                case "Mini PC" -> "Điểm nổi bật chính là **kích thước siêu nhỏ gọn** và **tiết kiệm năng lượng**, làm cho nó hoàn hảo cho các thiết lập tối giản hoặc HTPC.";
                case "PC để bàn" -> "Lợi thế chính là **khả năng nâng cấp dễ dàng** và việc bao gồm một **SSD 512GB nhanh** để hệ thống phản hồi nhanh chóng.";
                case "Laptop" -> "Điểm nổi bật của nó là **thời lượng pin 8 giờ ấn tượng** cho năng suất cả ngày và **màn hình Full HD sắc nét** mang lại trải nghiệm hình ảnh tuyệt vời khi di chuyển.";
                default -> "Được biết đến với **hiệu suất cao** và **thiết kế hiện đại**, phù hợp với nhiều nhu cầu người dùng khác nhau.";
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "Điểm nhấn chính là **đèn LED RGB tùy chỉnh** và **tấm kính cường lực tuyệt đẹp**, hoàn hảo để trưng bày bộ máy của bạn.";
                case "Tản nhiệt" -> "Điểm mạnh của nó nằm ở **hiệu suất làm mát vượt trội** được cung cấp bởi tản nhiệt nước, đảm bảo CPU của bạn hoạt động hiệu quả ngay cả khi tải nặng.";
                case "PSU" -> "Điểm thu hút lớn là **chứng nhận hiệu suất 80+ Gold** để tiết kiệm điện và ổn định, kết hợp với **thiết kế hoàn toàn mô-đun** để quản lý cáp gọn gàng hơn.";
                case "GPU" -> "Các tính năng nổi bật của nó là khả năng **dò tia (Ray Tracing) thời gian thực** cho đồ họa siêu thực và tối ưu hóa cho **chơi game 1440p** mượt mà.";
                case "Mainboard" -> "Sự tích hợp của **Wi-Fi 6** cho tốc độ không dây tiên tiến và **hỗ trợ PCIe 4.0** cho hiệu suất thành phần thế hệ tiếp theo là những điểm hấp dẫn chính của nó.";
                case "SSD/HDD" -> "Lợi ích chính là **tốc độ đọc/ghi cực nhanh** của SSD, giảm đáng kể thời gian tải.";
                case "RAM" -> "Tốc độ **3200MHz cao** và **hiệu suất tối ưu** của nó là rất quan trọng cho đa nhiệm và chơi game mượt mà.";
                case "CPU" -> "Các điểm nổi bật chính là **tốc độ xung nhịp tăng cường 4.5GHz** cho hiệu suất đơn nhân tuyệt vời và **thiết kế 8 nhân** cho khả năng đa nhiệm mạnh mẽ.";
                default -> "Điểm mạnh của nó là **hiệu suất tối ưu** và **độ bền bỉ**, làm cho nó trở thành một lựa chọn đáng tin cậy cho bất kỳ bản dựng PC nào.";
            };
            default -> "Tính năng nổi bật, đáng tin cậy và mang lại giá trị cao cho người dùng.";
        };
    }
    private String generatePromotions() {
        // Realistic promotions based on product type and season
        List<String> generalPromotions = Arrays.asList(
            "🎉 Giảm giá 5% khi mua online",
            "🚚 Miễn phí vận chuyển toàn quốc",
            "🎁 Tặng kèm phụ kiện trị giá 500K",
            "💳 Giảm thêm 3% khi thanh toán qua thẻ",
            "📱 Giảm 10% khi mua qua app",
            "⭐ Giảm 15% cho khách hàng VIP",
            "🎯 Giảm giá sốc cuối tuần",
            "🔥 Flash sale - Giảm đến 20%",
            "🎊 Khuyến mãi sinh nhật - Giảm 10%",
            "💎 Giảm giá đặc biệt cho combo"
        );

        List<String> techPromotions = Arrays.asList(
            "🔧 Bảo hành mở rộng 24 tháng",
            "⚡ Tặng gói bảo trì 1 năm",
            "🎮 Tặng game key trị giá 1 triệu",
            "💻 Tặng kèm chuột gaming cao cấp",
            "🎧 Tặng tai nghe bluetooth",
            "📦 Tặng balo laptop chống sốc",
            "🔌 Tặng bộ cáp kết nối đầy đủ",
            "🛡️ Tặng gói bảo mật 1 năm",
            "🎯 Tặng voucher mua hàng 500K",
            "🌟 Tặng gói cài đặt phần mềm"
        );

        List<String> seasonalPromotions = Arrays.asList(
            "🎓 Giảm 10% cho sinh viên",
            "👨‍💼 Giảm 8% cho doanh nghiệp",
            "👨‍👩‍👧‍👦 Giảm 12% cho gia đình",
            "🎉 Giảm giá Black Friday",
            "🎄 Giảm giá Giáng sinh",
            "🎊 Giảm giá Tết nguyên đán",
            "🌺 Giảm giá mùa hè",
            "🍂 Giảm giá mùa thu",
            "❄️ Giảm giá mùa đông",
            "🌸 Giảm giá mùa xuân"
        );

        // Combine different types of promotions
        List<String> allPromotions = new ArrayList<>();
        allPromotions.addAll(generalPromotions);
        allPromotions.addAll(techPromotions);
        allPromotions.addAll(seasonalPromotions);

        // Sometimes generate multiple promotions
        if (random.nextInt(100) < 30) { // 30% chance for multiple promotions
            String promo1 = allPromotions.get(random.nextInt(allPromotions.size()));
            String promo2 = allPromotions.get(random.nextInt(allPromotions.size()));
            return promo1 + " | " + promo2;
        } else {
            return allPromotions.get(random.nextInt(allPromotions.size()));
        }
    }
}
