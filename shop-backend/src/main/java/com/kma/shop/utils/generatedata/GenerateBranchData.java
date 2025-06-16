package com.kma.shop.utils.generatedata;

import com.kma.shop.entity.BranchEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.BranchService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenerateBranchData {
    BranchService branchService;
    Random random = new Random();

    public GenerateBranchData(BranchService branchService) {
        this.branchService = branchService;
    }

    public void generate()  {
        if (branchService.count() < 1) {
            int numberOfBranches = random.nextInt(6) + 5; // Generate 5-10 branches
            for (int i = 0; i < numberOfBranches; i++) {
                BranchEntity branch = buildBranch();
                branchService.save(branch);
            }
        }
    }

    private BranchEntity buildBranch() {
        String name = generateBranchName();
        String description = generateBranchDescription(name);

        return BranchEntity.builder()
                .name(name)
                .description(description)
                .categories(new ArrayList<>())
                .build();
    }


    private final List<String> brandNames = Arrays.asList(
            // Laptop brands
            "MSI", "ThinkBook", "MacBook", "Asus", "Acer", "Dell", "HP", "Lenovo",

            // Camera brands
            "Canon", "Sony", "Nikon", "GoPro", "Panasonic", "Fujifilm", "Hikvision", "Dahua",

            // PC component brands
            "Intel", "AMD", "NVIDIA", "Corsair", "Kingston", "G.Skill", "ASRock", "Gigabyte", "Cooler Master", "NZXT"
    );

    private final Map<String, String> descriptionsByBrand = Map.ofEntries(
            // Laptop
            Map.entry("MSI", "Laptop và bo mạch chủ nổi tiếng dành cho game thủ."),
            Map.entry("ThinkBook", "Dòng laptop doanh nhân hiệu suất cao của Lenovo."),
            Map.entry("MacBook", "Thiết kế sang trọng, tối ưu cho hệ sinh thái Apple."),
            Map.entry("Asus", "Thương hiệu laptop và linh kiện phổ biến với độ bền cao."),
            Map.entry("Acer", "Laptop học tập, văn phòng phổ thông, giá hợp lý."),
            Map.entry("Dell", "Laptop bền bỉ, hỗ trợ doanh nghiệp và người dùng cá nhân."),
            Map.entry("HP", "Cân bằng giữa hiệu năng và giá cả cho người dùng phổ thông."),
            Map.entry("Lenovo", "Laptop đa dạng phân khúc, phù hợp nhiều nhu cầu."),

            // Camera
            Map.entry("Canon", "Thương hiệu máy ảnh và camera nổi tiếng thế giới."),
            Map.entry("Sony", "Chuyên máy ảnh mirrorless, cảm biến chất lượng cao."),
            Map.entry("Nikon", "Máy ảnh DSLR và thiết bị quang học chính xác."),
            Map.entry("GoPro", "Camera hành trình gọn nhẹ, chống rung tốt."),
            Map.entry("Panasonic", "Camera và thiết bị video cho quay phim chuyên nghiệp."),
            Map.entry("Fujifilm", "Máy ảnh retro với chất ảnh ấn tượng."),
            Map.entry("Hikvision", "Hệ thống camera giám sát an ninh hàng đầu."),
            Map.entry("Dahua", "Giải pháp camera an ninh tối ưu cho doanh nghiệp."),

            // PC components
            Map.entry("Intel", "CPU phổ biến với hiệu năng ổn định và tiết kiệm điện."),
            Map.entry("AMD", "CPU và GPU hiệu năng cao, giá cạnh tranh."),
            Map.entry("NVIDIA", "GPU mạnh mẽ, chuyên dùng cho đồ họa và AI."),
            Map.entry("Corsair", "RAM, PSU, bàn phím cơ chất lượng cao."),
            Map.entry("Kingston", "RAM, SSD đáng tin cậy cho cá nhân và doanh nghiệp."),
            Map.entry("G.Skill", "RAM hiệu năng cao dành cho game thủ và dân build PC."),
            Map.entry("ASRock", "Bo mạch chủ phổ thông đến cao cấp, giá tốt."),
            Map.entry("Gigabyte", "Mainboard, VGA, thiết bị gaming bền bỉ."),
            Map.entry("Cooler Master", "Giải pháp tản nhiệt và case PC chuyên nghiệp."),
            Map.entry("NZXT", "Case PC cao cấp và hệ thống tản nhiệt custom.")
    );

    // Sinh ngẫu nhiên tên branch
    private String generateBranchName() {
        return brandNames.get(random.nextInt(brandNames.size()));
    }

    // Mô tả tương ứng
    private String generateBranchDescription(String brandName) {
        return descriptionsByBrand.getOrDefault(
                brandName,
                "Thương hiệu công nghệ được ưa chuộng trên toàn thế giới."
        );
    }

}