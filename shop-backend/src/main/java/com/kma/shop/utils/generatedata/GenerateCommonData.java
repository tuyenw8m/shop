package com.kma.shop.utils.generatedata;

import com.kma.shop.entity.BranchEntity;
import com.kma.shop.entity.ChildCategoryEntity;
import com.kma.shop.entity.ParentCategoryEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.service.interfaces.BranchService;
import com.kma.shop.service.interfaces.CategoryServiceV2;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenerateCommonData {
    CategoryServiceV2 categoryServiceV2;
    Random random = new Random();
    BranchService branchService;

    public GenerateCommonData(CategoryServiceV2 categoryServiceV2, BranchService branchService) throws AppException {
        this.categoryServiceV2 = categoryServiceV2;
        this.branchService = branchService;
    }

    public void generate() throws AppException {
        String parentCamera = "Camera";
        if (!categoryServiceV2.existParentByName(parentCamera)) {
            ParentCategoryEntity camera = generateCameraParentCategories();
            ParentCategoryEntity mayTinh = generateMayTinhParentCategories();
            ParentCategoryEntity linhKien = generateLinhKienParentCategories();

            camera = categoryServiceV2.saveParent(camera);
            mayTinh = categoryServiceV2.saveParent(mayTinh);
            linhKien = categoryServiceV2.saveParent(linhKien);

            List<ChildCategoryEntity> cameraChildCategories = generateCameraChildCategories(camera);
            List<ChildCategoryEntity> mayTinhChildCategories = generateMayTinhChildCategories(mayTinh);
            List<ChildCategoryEntity> linhKienChildCategories = generateLinhKienChildCategories(linhKien);

            // Save child categories and assign branches
            saveAndAssignBranchesToChildCategories(cameraChildCategories);
            saveAndAssignBranchesToChildCategories(mayTinhChildCategories);
            saveAndAssignBranchesToChildCategories(linhKienChildCategories);

            camera.setChildCategories(cameraChildCategories);
            mayTinh.setChildCategories(mayTinhChildCategories);
            linhKien.setChildCategories(linhKienChildCategories);

            categoryServiceV2.saveParent(camera);
            categoryServiceV2.saveParent(mayTinh);
            categoryServiceV2.saveParent(linhKien);
        }
    }

    private void saveAndAssignBranchesToChildCategories(List<ChildCategoryEntity> childCategories) throws AppException {
        List<BranchEntity> existingBranches = branchService.findAll();
        if (existingBranches.isEmpty()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        for (ChildCategoryEntity child : childCategories) {
            categoryServiceV2.saveChild(child);
            // Randomly select 2-4 branches
            int numberOfBranches = random.nextInt(3) + 2;
            List<BranchEntity> selectedBranches = new ArrayList<>();
            for (int i = 0; i < numberOfBranches && !existingBranches.isEmpty(); i++) {
                int index = random.nextInt(existingBranches.size());
                selectedBranches.add(existingBranches.get(index));
            }
            child.setBranches(selectedBranches);
            categoryServiceV2.saveChild(child);
        }
    }

    private List<BranchEntity> generateBranchesForCategory(ChildCategoryEntity child) throws AppException {
        int numberOfBranches = random.nextInt(3) + 2; // 2-4 branches per child category
        List<BranchEntity> branches = new ArrayList<>();
        for (int i = 0; i < numberOfBranches; i++) {
            BranchEntity branch = buildBranch(child);
            branches.add(branch);
            branchService.save(branch);
        }
        return branches;
    }

    private BranchEntity buildBranch(ChildCategoryEntity child) {
        String parentName = child.getParent().getName();
        String childName = child.getName();
        String name = generateProductName(parentName, childName);
        String description = generateBranchDescription(parentName, childName);

        return BranchEntity.builder()
                .name(name)
                .description(description)
                .categories(List.of(child))
                .build();
    }

    private String generateProductName(String parentName, String childName) {
        List<String> brandPrefixes = Arrays.asList("Tech", "Vision", "Power", "Core", "Elite", "Pro", "Innovate", "Future", "Smart");
        List<String> brandSuffixes = Arrays.asList("Electronics", "Solutions", "Gear", "Tech", "Systems", "Innovations");

        String prefix = brandPrefixes.get(random.nextInt(brandPrefixes.size()));
        String suffix = brandSuffixes.get(random.nextInt(brandSuffixes.size()));
        String categoryIndicator = switch (parentName) {
            case "Camera" -> switch (childName) {
                case "Camera hành động" -> "Action";
                case "Camera chuyên nghiệp" -> "ProCam";
                case "Webcam" -> "Web";
                case "Camera an ninh/IP" -> "Security";
                case "Camera hành trình" -> "Dash";
                default -> "Cam";
            };
            case "Máy tính" -> switch (childName) {
                case "PC gaming" -> "Game";
                case "PC đồ họa / workstation" -> "Work";
                case "Mini PC" -> "Mini";
                case "PC để bàn" -> "Desk";
                case "Laptop" -> "Lap";
                default -> "PC";
            };
            case "Linh kiện" -> switch (childName) {
                case "Case" -> "Case";
                case "Tản nhiệt" -> "Cool";
                case "PSU" -> "Power";
                case "GPU" -> "Graph";
                case "Mainboard" -> "Board";
                case "SSD/HDD" -> "Storage";
                case "RAM" -> "Memory";
                case "CPU" -> "Proc";
                default -> "Comp";
            };
            default -> "Tech";
        };
        return prefix + categoryIndicator + suffix;
    }

    private String generateBranchDescription(String parentName, String childName) {
        List<String> descriptors = Arrays.asList(
                "Chuyên cung cấp sản phẩm chất lượng cao, đáng tin cậy.",
                "Đồng hành cùng bạn với công nghệ tiên tiến nhất.",
                "Mang đến giải pháp tối ưu cho mọi nhu cầu.",
                "Sản phẩm được thiết kế dành riêng cho hiệu suất vượt trội.",
                "Đảm bảo chất lượng và dịch vụ hỗ trợ tối đa."
        );
        return descriptors.get(random.nextInt(descriptors.size())) + " Tập trung vào " + childName + " thuộc danh mục " + parentName + ".";
    }

    public List<ChildCategoryEntity> generateLinhKienChildCategories(ParentCategoryEntity parent) throws AppException {
        List<ChildCategoryEntity> childCategories = new ArrayList<>();
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Bảo vệ linh kiện và hỗ trợ luồng gió tản nhiệt. Nhiều thiết kế hiện đại, đèn LED RGB và không gian lắp đặt tiện lợi.")
                .name("Case")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Giữ cho hệ thống luôn mát mẻ, hoạt động ổn định, tránh quá nhiệt. Có loại tản khí và tản nước tùy nhu cầu sử dụng.")
                .name("Tản nhiệt")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Cung cấp điện năng ổn định và an toàn cho toàn hệ thống. Nguồn chất lượng cao giúp bảo vệ linh kiện và kéo dài tuổi thọ máy.")
                .name("PSU")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Phục vụ nhu cầu chơi game, thiết kế, dựng phim với hiệu suất đồ họa vượt trội. Hỗ trợ các công nghệ mới như Ray Tracing, AI Upscaling.")
                .name("GPU")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Nền tảng kết nối mọi linh kiện. Lựa chọn đúng mainboard giúp hệ thống hoạt động ổn định và dễ dàng nâng cấp.")
                .name("Mainboard")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Lưu trữ dữ liệu an toàn, truy xuất nhanh chóng. SSD cho tốc độ cao, HDD cho dung lượng lớn với chi phí tối ưu.")
                .name("SSD/HDD")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Bộ nhớ tạm thời cho hiệu suất đa nhiệm mượt mà. Nâng cấp RAM giúp máy xử lý nhanh hơn khi mở nhiều ứng dụng.")
                .name("RAM")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Trái tim của máy tính. Lựa chọn CPU phù hợp giúp máy tính xử lý nhanh, tiết kiệm điện và hoạt động ổn định hơn.")
                .name("CPU")
                .build());
        return childCategories;
    }

    public List<ChildCategoryEntity> generateMayTinhChildCategories(ParentCategoryEntity parent) throws AppException {
        List<ChildCategoryEntity> childCategories = new ArrayList<>();
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Tối ưu hiệu suất chơi game với GPU mạnh mẽ, tản nhiệt tốt và thiết kế đậm chất game thủ.")
                .name("PC gaming")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Hiệu năng cực cao với card đồ họa chuyên dụng và RAM lớn, đáp ứng công việc dựng phim, thiết kế 3D, CAD, v.v.")
                .name("PC đồ họa / workstation")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Nhỏ gọn nhưng hiệu quả, Mini PC tiết kiệm không gian và năng lượng, lý tưởng cho văn phòng và nhu cầu cơ bản.")
                .name("Mini PC")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Cấu hình mạnh mẽ, dễ nâng cấp và bền bỉ theo thời gian. Phù hợp cho công việc chuyên môn, học tập hoặc giải trí tại nhà.")
                .name("PC để bàn")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Thiết kế mỏng nhẹ, pin bền và cấu hình linh hoạt. Laptop phù hợp cho học sinh, sinh viên, dân văn phòng và cả game thủ.")
                .name("Laptop")
                .build());
        return childCategories;
    }

    public List<ChildCategoryEntity> generateCameraChildCategories(ParentCategoryEntity parent) throws AppException {
        List<ChildCategoryEntity> childCategories = new ArrayList<>();
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Nhỏ gọn, bền bỉ và chống nước, Action Cam là bạn đồng hành lý tưởng cho các hoạt động thể thao, du lịch và khám phá.")
                .name("Camera hành động")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Dành cho nhiếp ảnh gia và người sáng tạo nội dung, mang lại hình ảnh sắc nét, màu sắc chân thực và nhiều chế độ tuỳ chỉnh chuyên sâu.")
                .name("Camera chuyên nghiệp")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Webcam chất lượng cao cho học online, họp trực tuyến và livestream. Độ phân giải rõ nét, dễ dàng kết nối với máy tính.")
                .name("Webcam")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Giải pháp giám sát thông minh cho gia đình và doanh nghiệp. Tích hợp công nghệ AI, kết nối Wi-Fi, quan sát từ xa 24/7.")
                .name("Camera an ninh/IP")
                .build());
        childCategories.add(ChildCategoryEntity.builder()
                .parent(parent)
                .description("Ghi lại mọi cung đường bạn đi qua. Camera hành trình giúp lưu lại bằng chứng khi xảy ra va chạm và hỗ trợ lái xe an toàn.")
                .name("Camera hành trình")
                .build());
        return childCategories;
    }

    public ParentCategoryEntity generateCameraParentCategories() {
        return ParentCategoryEntity.builder()
                .name("Camera")
                .description("Camera là thiết bị ghi hình được sử dụng rộng rãi trong đời sống cá nhân và công việc." +
                        " Từ camera chuyên nghiệp cho nhiếp ảnh gia, camera hành trình cho người đam mê du lịch," +
                        " đến camera an ninh bảo vệ ngôi nhà, tất cả đều phục vụ nhu cầu ghi hình chất lượng cao." +
                        " Sản phẩm đa dạng về mẫu mã, độ phân giải, khả năng quay ban đêm, chống nước và tích hợp " +
                        "công nghệ AI, giúp bạn lưu giữ và bảo vệ mọi khoảnh khắc quan trọng.")
                .build();
    }

    public ParentCategoryEntity generateMayTinhParentCategories() {
        return ParentCategoryEntity.builder()
                .name("Máy tính")
                .description("Máy tính là thiết bị điện tử trung tâm trong hầu hết các hoạt động hiện đại. Tại đây, bạn " +
                        "có thể tìm thấy từ laptop mỏng nhẹ cho công việc di động, máy tính để bàn mạnh mẽ cho đồ họa " +
                        "hoặc gaming, đến các dòng máy phục vụ học tập, văn phòng và làm việc từ xa. Với cấu hình đa dạng," +
                        " thiết kế hiện đại và hiệu suất ổn định, sản phẩm máy tính luôn sẵn sàng đáp ứng mọi nhu cầu của bạn.")
                .build();
    }

    public ParentCategoryEntity generateLinhKienParentCategories() {
        return ParentCategoryEntity.builder()
                .name("Linh kiện")
                .description("Linh kiện máy tính bao gồm các bộ phận cốt lõi như CPU, RAM, ổ cứng, bo mạch chủ, " +
                        "card đồ họa, nguồn và tản nhiệt. Đây là những thành phần quyết định hiệu suất, tốc độ và khả năng" +
                        " mở rộng của hệ thống. Dù bạn đang muốn nâng cấp chiếc PC cũ, xây dựng dàn máy chơi game cao cấp," +
                        " hay đơn giản là tối ưu cho công việc văn phòng, việc chọn đúng linh kiện sẽ giúp hệ thống hoạt" +
                        " động mượt mà và bền bỉ.")
                .build();
    }
}