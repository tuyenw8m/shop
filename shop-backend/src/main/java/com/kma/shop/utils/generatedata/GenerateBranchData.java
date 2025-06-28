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
            System.out.println("🔄 Generating " + numberOfBranches + " branches...");
            
            for (int i = 0; i < numberOfBranches; i++) {
                BranchEntity branch = buildBranch();
                branchService.save(branch);
            }
            
            System.out.println("✅ Generated " + numberOfBranches + " branches successfully");
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

    // Realistic tech store branch names
    private final List<String> branchNames = Arrays.asList(
        // Major tech brands
        "Apple Store", "Samsung Experience Store", "Microsoft Store", "Dell Store", "HP Store",
        "Lenovo Store", "Asus Store", "Acer Store", "MSI Store", "Gigabyte Store",
        
        // Camera and photography brands
        "Canon Store", "Sony Store", "Nikon Store", "GoPro Store", "Fujifilm Store",
        
        // Component brands
        "Intel Store", "AMD Store", "NVIDIA Store", "Corsair Store", "Kingston Store",
        "G.Skill Store", "ASRock Store", "Cooler Master Store", "NZXT Store",
        
        // Vietnamese tech store chains
        "TechShop", "FPT Shop", "Thế Giới Di Động", "Điện Máy Xanh", "MediaMart",
        "Nguyễn Kim", "Điện Máy Chợ Lớn", "Tran Anh Digital", "Phong Vũ", "An Phát"
    );

    // Branch descriptions by type
    private final Map<String, String> branchDescriptions = Map.ofEntries(
        // Apple Store
        Map.entry("Apple Store", "Cửa hàng chính thức của Apple tại Việt Nam. Chuyên cung cấp iPhone, iPad, MacBook, Apple Watch và các phụ kiện chính hãng với dịch vụ bảo hành và hỗ trợ tối ưu."),
        
        // Samsung
        Map.entry("Samsung Experience Store", "Trải nghiệm công nghệ Samsung với đầy đủ sản phẩm từ smartphone, tablet, laptop đến TV và thiết bị gia dụng thông minh."),
        
        // Microsoft
        Map.entry("Microsoft Store", "Cửa hàng chính thức Microsoft với Surface, Xbox, Office và các giải pháp công nghệ doanh nghiệp."),
        
        // Dell
        Map.entry("Dell Store", "Chuyên cung cấp laptop, desktop, workstation và server Dell chính hãng với dịch vụ bảo hành toàn quốc."),
        
        // HP
        Map.entry("HP Store", "Cửa hàng HP chính thức với đa dạng laptop, máy in và giải pháp công nghệ cho cá nhân và doanh nghiệp."),
        
        // Lenovo
        Map.entry("Lenovo Store", "ThinkPad, IdeaPad và các sản phẩm Lenovo chính hãng với chất lượng đẳng cấp thế giới."),
        
        // Asus
        Map.entry("Asus Store", "ROG Gaming, ZenBook, VivoBook và các sản phẩm Asus cao cấp cho gaming và công việc."),
        
        // Acer
        Map.entry("Acer Store", "Predator Gaming, Swift, Aspire và các laptop Acer chất lượng cao với giá cả hợp lý."),
        
        // MSI
        Map.entry("MSI Store", "Chuyên gaming laptop, desktop và linh kiện MSI với hiệu năng đỉnh cao cho game thủ."),
        
        // Gigabyte
        Map.entry("Gigabyte Store", "AORUS Gaming, mainboard, VGA và các linh kiện Gigabyte chất lượng cao."),
        
        // Camera brands
        Map.entry("Canon Store", "Máy ảnh DSLR, mirrorless, ống kính và phụ kiện Canon chính hãng cho nhiếp ảnh gia."),
        Map.entry("Sony Store", "Alpha mirrorless, Cyber-shot và các sản phẩm Sony với công nghệ cảm biến tiên tiến."),
        Map.entry("Nikon Store", "Máy ảnh DSLR, ống kính Nikkor và phụ kiện Nikon chuyên nghiệp."),
        Map.entry("GoPro Store", "Camera hành động GoPro chính hãng cho những cuộc phiêu lưu và thể thao mạo hiểm."),
        Map.entry("Fujifilm Store", "X-Series, GFX và các máy ảnh Fujifilm với chất ảnh độc đáo và thiết kế retro."),
        
        // Component brands
        Map.entry("Intel Store", "CPU Intel Core, Xeon và các giải pháp xử lý hiệu năng cao cho mọi nhu cầu."),
        Map.entry("AMD Store", "Ryzen, EPYC và các sản phẩm AMD với hiệu năng vượt trội và giá cả cạnh tranh."),
        Map.entry("NVIDIA Store", "GeForce RTX, Quadro và các GPU NVIDIA với công nghệ Ray Tracing tiên tiến."),
        Map.entry("Corsair Store", "RAM, PSU, cooling và phụ kiện gaming Corsair chất lượng cao."),
        Map.entry("Kingston Store", "RAM, SSD Kingston chính hãng với độ tin cậy và hiệu năng ổn định."),
        Map.entry("G.Skill Store", "RAM gaming G.Skill với hiệu năng cao và thiết kế RGB đẹp mắt."),
        Map.entry("ASRock Store", "Mainboard ASRock chất lượng cao với giá cả hợp lý cho mọi cấu hình."),
        Map.entry("Cooler Master Store", "Case, cooling và phụ kiện Cooler Master cho hệ thống gaming."),
        Map.entry("NZXT Store", "Case, cooling NZXT với thiết kế tối giản và chất lượng cao cấp."),
        
        // Vietnamese chains
        Map.entry("TechShop", "Chuỗi cửa hàng công nghệ hàng đầu Việt Nam với đa dạng sản phẩm và dịch vụ chuyên nghiệp."),
        Map.entry("FPT Shop", "Hệ thống bán lẻ công nghệ FPT với đầy đủ smartphone, laptop và thiết bị số."),
        Map.entry("Thế Giới Di Động", "Chuỗi bán lẻ điện thoại và thiết bị số lớn nhất Việt Nam với giá cả cạnh tranh."),
        Map.entry("Điện Máy Xanh", "Chuyên cung cấp điện máy, điện lạnh và thiết bị công nghệ với dịch vụ tận tâm."),
        Map.entry("MediaMart", "Siêu thị điện máy MediaMart với đa dạng sản phẩm và chính sách bảo hành tốt."),
        Map.entry("Nguyễn Kim", "Chuỗi siêu thị điện máy Nguyễn Kim với uy tín và chất lượng dịch vụ hàng đầu."),
        Map.entry("Điện Máy Chợ Lớn", "Chuyên cung cấp điện máy, điện lạnh với giá cả hợp lý và dịch vụ tốt."),
        Map.entry("Tran Anh Digital", "Cửa hàng công nghệ Tran Anh với đa dạng sản phẩm và tư vấn chuyên nghiệp."),
        Map.entry("Phong Vũ", "Chuỗi cửa hàng công nghệ Phong Vũ với sản phẩm chính hãng và dịch vụ tốt."),
        Map.entry("An Phát", "Cửa hàng linh kiện máy tính An Phát với đa dạng sản phẩm và giá cả cạnh tranh.")
    );

    private String generateBranchName() {
        return branchNames.get(random.nextInt(branchNames.size()));
    }

    private String generateBranchDescription(String branchName) {
        return branchDescriptions.getOrDefault(
            branchName,
            "Cửa hàng công nghệ chuyên nghiệp với đa dạng sản phẩm chất lượng cao, dịch vụ tận tâm và chính sách bảo hành tốt."
        );
    }
}