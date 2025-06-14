package com.kma.shop.utils;

import com.kma.shop.entity.BranchEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.BranchService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenerateBranchData {
    BranchService branchService;
    Random random = new Random();

    public GenerateBranchData(BranchService branchService) {
        this.branchService = branchService;
    }

    public void generate() throws AppException {
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
        String description = generateBranchDescription();

        return BranchEntity.builder()
                .name(name)
                .description(description)
                .categories(new ArrayList<>()) // Initialize empty categories
                .build();
    }

    private String generateBranchName() {
        List<String> brandPrefixes = Arrays.asList("Tech", "Vision", "Power", "Core", "Elite", "Pro", "Innovate", "Future", "Smart");
        List<String> brandSuffixes = Arrays.asList("Electronics", "Solutions", "Gear", "Tech", "Systems", "Innovations");
        List<String> categoryIndicators = Arrays.asList("Action", "ProCam", "Web", "Security", "Dash", "Game", "Work", "Mini", "Desk", "Lap", "Case", "Cool", "Power", "Graph", "Board", "Storage", "Memory", "Proc");

        String prefix = brandPrefixes.get(random.nextInt(brandPrefixes.size()));
        String suffix = brandSuffixes.get(random.nextInt(brandSuffixes.size()));
        String indicator = categoryIndicators.get(random.nextInt(categoryIndicators.size()));
        return prefix + indicator + suffix;
    }

    private String generateBranchDescription() {
        List<String> descriptors = Arrays.asList(
                "Chuyên cung cấp sản phẩm chất lượng cao, đáng tin cậy.",
                "Đồng hành cùng bạn với công nghệ tiên tiến nhất.",
                "Mang đến giải pháp tối ưu cho mọi nhu cầu.",
                "Sản phẩm được thiết kế dành riêng cho hiệu suất vượt trội.",
                "Đảm bảo chất lượng và dịch vụ hỗ trợ tối đa."
        );
        return descriptors.get(random.nextInt(descriptors.size()));
    }
}