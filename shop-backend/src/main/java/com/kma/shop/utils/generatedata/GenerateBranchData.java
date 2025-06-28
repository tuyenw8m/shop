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
            int numberOfBranches = random.nextInt(6) + 8; // Generate 8-13 branches
            System.out.println("🔄 Generating " + numberOfBranches + " product brands...");
            
            for (int i = 0; i < numberOfBranches; i++) {
                BranchEntity branch = buildBranch();
                branchService.save(branch);
            }
            
            System.out.println("✅ Generated " + numberOfBranches + " product brands successfully");
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

    // Product brand names (not retail stores)
    private final List<String> brandNames = Arrays.asList(
        // Laptop and PC brands
        "MSI", "Lenovo", "Dell", "HP", "Asus", "Acer", "Apple", "Gigabyte", "Razer", "Alienware",
        
        // Camera and photography brands
        "Canon", "Sony", "Nikon", "GoPro", "Fujifilm", "Panasonic", "Olympus", "Leica", "DJI", "Insta360",
        
        // PC component brands
        "Intel", "AMD", "NVIDIA", "Corsair", "Kingston", "G.Skill", "ASRock", "Cooler Master", "NZXT", "Seagate",
        "Western Digital", "Samsung", "Crucial", "EVGA", "Thermaltake", "be quiet!", "Phanteks", "Lian Li",
        
        // Gaming and peripheral brands
        "Logitech", "SteelSeries", "HyperX", "ROCCAT", "Mad Catz", "Trust", "Creative", "Audio-Technica",
        
        // Network and storage brands
        "TP-Link", "ASUS", "Netgear", "D-Link", "Synology", "QNAP", "Buffalo", "LaCie"
    );

    // Brand descriptions by type
    private final Map<String, String> brandDescriptions = Map.ofEntries(
        // Laptop and PC brands
        Map.entry("MSI", "Thương hiệu laptop gaming và bo mạch chủ hàng đầu thế giới. Chuyên cung cấp các sản phẩm gaming hiệu năng cao với thiết kế độc đáo và công nghệ tiên tiến."),
        Map.entry("Lenovo", "Tập đoàn công nghệ đa quốc gia với các sản phẩm ThinkPad, IdeaPad nổi tiếng. Chuyên về laptop doanh nhân, gaming và thiết bị di động chất lượng cao."),
        Map.entry("Dell", "Thương hiệu máy tính hàng đầu với dòng sản phẩm đa dạng từ laptop văn phòng đến workstation chuyên nghiệp. Nổi tiếng với dịch vụ khách hàng xuất sắc."),
        Map.entry("HP", "Hewlett-Packard - thương hiệu công nghệ lâu đời với đa dạng sản phẩm từ laptop, máy in đến thiết bị văn phòng. Cân bằng hoàn hảo giữa hiệu năng và giá cả."),
        Map.entry("Asus", "Thương hiệu Đài Loan nổi tiếng với ROG Gaming, ZenBook và các sản phẩm chất lượng cao. Chuyên về laptop gaming, ultrabook và linh kiện máy tính."),
        Map.entry("Acer", "Thương hiệu laptop giá rẻ chất lượng tốt với dòng Predator Gaming và Aspire. Phù hợp cho học sinh, sinh viên và người dùng phổ thông."),
        Map.entry("Apple", "Tập đoàn công nghệ hàng đầu với hệ sinh thái khép kín. MacBook, iPhone, iPad và các sản phẩm cao cấp với thiết kế tối giản và hiệu năng vượt trội."),
        Map.entry("Gigabyte", "Thương hiệu Đài Loan chuyên về mainboard, VGA và laptop gaming AORUS. Nổi tiếng với chất lượng build và hiệu năng ổn định."),
        Map.entry("Razer", "Thương hiệu gaming chuyên nghiệp với laptop Blade, chuột, bàn phím và phụ kiện gaming cao cấp. Thiết kế đen xanh đặc trưng."),
        Map.entry("Alienware", "Thương hiệu gaming cao cấp thuộc Dell. Chuyên về laptop và desktop gaming với thiết kế độc đáo và hiệu năng đỉnh cao."),
        
        // Camera brands
        Map.entry("Canon", "Thương hiệu máy ảnh Nhật Bản hàng đầu thế giới. Chuyên về DSLR, mirrorless và ống kính chất lượng cao cho nhiếp ảnh gia chuyên nghiệp."),
        Map.entry("Sony", "Tập đoàn điện tử Nhật Bản với dòng Alpha mirrorless nổi tiếng. Công nghệ cảm biến tiên tiến và video 4K chất lượng cao."),
        Map.entry("Nikon", "Thương hiệu máy ảnh DSLR truyền thống với ống kính Nikkor chất lượng cao. Được ưa chuộng bởi nhiếp ảnh gia và nhà báo."),
        Map.entry("GoPro", "Thương hiệu camera hành động hàng đầu thế giới. Chuyên về camera nhỏ gọn, chống nước cho thể thao mạo hiểm và du lịch."),
        Map.entry("Fujifilm", "Thương hiệu máy ảnh với chất ảnh độc đáo và thiết kế retro. X-Series và GFX series được yêu thích bởi nhiếp ảnh gia."),
        Map.entry("Panasonic", "Thương hiệu điện tử Nhật Bản với Lumix series. Chuyên về camera mirrorless và video chuyên nghiệp."),
        Map.entry("Olympus", "Thương hiệu máy ảnh với OM-D series nổi tiếng. Thiết kế nhỏ gọn và ổn định hình ảnh 5 trục."),
        Map.entry("Leica", "Thương hiệu máy ảnh cao cấp của Đức. Nổi tiếng với chất lượng quang học xuất sắc và thiết kế sang trọng."),
        Map.entry("DJI", "Thương hiệu drone và camera hàng đầu thế giới. Chuyên về thiết bị bay và camera chuyên nghiệp."),
        Map.entry("Insta360", "Thương hiệu camera 360 độ và action cam mới nổi. Công nghệ ổn định hình ảnh FlowState độc đáo."),
        
        // PC component brands
        Map.entry("Intel", "Tập đoàn bán dẫn hàng đầu thế giới. Chuyên về CPU Core series, Xeon và các giải pháp xử lý hiệu năng cao."),
        Map.entry("AMD", "Thương hiệu CPU và GPU với Ryzen, EPYC series. Nổi tiếng với hiệu năng cao và giá cả cạnh tranh."),
        Map.entry("NVIDIA", "Thương hiệu GPU hàng đầu với GeForce RTX, Quadro series. Công nghệ Ray Tracing và AI tiên tiến."),
        Map.entry("Corsair", "Thương hiệu phụ kiện gaming với RAM, PSU, cooling và bàn phím cơ chất lượng cao."),
        Map.entry("Kingston", "Thương hiệu bộ nhớ và lưu trữ với RAM, SSD HyperX. Độ tin cậy cao và hiệu năng ổn định."),
        Map.entry("G.Skill", "Thương hiệu RAM gaming với hiệu năng cao và thiết kế RGB đẹp mắt. Được yêu thích bởi game thủ."),
        Map.entry("ASRock", "Thương hiệu mainboard với giá cả hợp lý và chất lượng tốt. Phù hợp cho nhiều cấu hình khác nhau."),
        Map.entry("Cooler Master", "Thương hiệu cooling và case PC chuyên nghiệp. Giải pháp tản nhiệt hiệu quả cho gaming."),
        Map.entry("NZXT", "Thương hiệu case và cooling với thiết kế tối giản, hiện đại. Chất lượng cao cấp cho build PC."),
        Map.entry("Seagate", "Thương hiệu ổ cứng và SSD với Barracuda, IronWolf series. Dung lượng lớn và độ tin cậy cao."),
        Map.entry("Western Digital", "Thương hiệu lưu trữ với WD Blue, Black, Red series. Đa dạng sản phẩm cho mọi nhu cầu."),
        Map.entry("Samsung", "Tập đoàn điện tử Hàn Quốc với SSD 970 EVO, QVO series. Tốc độ cao và độ bền tốt."),
        Map.entry("Crucial", "Thương hiệu RAM và SSD của Micron. Chất lượng tốt với giá cả cạnh tranh."),
        Map.entry("EVGA", "Thương hiệu GPU và PSU gaming với chất lượng cao và dịch vụ khách hàng tốt."),
        Map.entry("Thermaltake", "Thương hiệu case, cooling và PSU gaming. Thiết kế RGB đẹp mắt và hiệu năng tốt."),
        Map.entry("be quiet!", "Thương hiệu cooling và PSU với tiếng ồn thấp. Chuyên về giải pháp tản nhiệt yên tĩnh."),
        Map.entry("Phanteks", "Thương hiệu case PC với thiết kế hiện đại và chất lượng cao. Phù hợp cho build PC cao cấp."),
        Map.entry("Lian Li", "Thương hiệu case PC cao cấp với thiết kế độc đáo và chất liệu nhôm cao cấp."),
        
        // Gaming and peripheral brands
        Map.entry("Logitech", "Thương hiệu chuột, bàn phím và webcam hàng đầu. Chất lượng cao và thiết kế ergonomic."),
        Map.entry("SteelSeries", "Thương hiệu gaming gear với chuột, bàn phím, tai nghe chất lượng cao cho game thủ."),
        Map.entry("HyperX", "Thương hiệu gaming gear của Kingston. Tai nghe, bàn phím và chuột gaming chất lượng tốt."),
        Map.entry("ROCCAT", "Thương hiệu gaming gear với thiết kế độc đáo và công nghệ tiên tiến."),
        Map.entry("Mad Catz", "Thương hiệu gaming gear với thiết kế độc đáo cho game thủ chuyên nghiệp."),
        Map.entry("Trust", "Thương hiệu phụ kiện máy tính với giá cả hợp lý và chất lượng ổn định."),
        Map.entry("Creative", "Thương hiệu âm thanh với sound card và loa chất lượng cao."),
        Map.entry("Audio-Technica", "Thương hiệu tai nghe và microphone chuyên nghiệp với chất lượng âm thanh xuất sắc."),
        
        // Network and storage brands
        Map.entry("TP-Link", "Thương hiệu thiết bị mạng với router, switch chất lượng tốt và giá cả hợp lý."),
        Map.entry("Netgear", "Thương hiệu thiết bị mạng cao cấp với router, switch chuyên nghiệp."),
        Map.entry("D-Link", "Thương hiệu thiết bị mạng với đa dạng sản phẩm cho gia đình và doanh nghiệp."),
        Map.entry("Synology", "Thương hiệu NAS chuyên nghiệp với hệ điều hành DSM tiên tiến."),
        Map.entry("QNAP", "Thương hiệu NAS với đa dạng sản phẩm cho cá nhân và doanh nghiệp."),
        Map.entry("Buffalo", "Thương hiệu lưu trữ và thiết bị mạng với chất lượng Nhật Bản."),
        Map.entry("LaCie", "Thương hiệu lưu trữ cao cấp với thiết kế độc đáo và chất lượng xuất sắc.")
    );

    private String generateBranchName() {
        return brandNames.get(random.nextInt(brandNames.size()));
    }

    private String generateBranchDescription(String brandName) {
        return brandDescriptions.getOrDefault(
            brandName,
            "Thương hiệu công nghệ uy tín với đa dạng sản phẩm chất lượng cao, được tin tưởng bởi người dùng trên toàn thế giới."
        );
    }
}