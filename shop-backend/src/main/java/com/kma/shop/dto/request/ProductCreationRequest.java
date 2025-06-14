package com.kma.shop.dto.request;

import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ImageEntity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreationRequest {
    private String name;
    private float price;
    private String description;
    private String technical_specs;
    private String highlight_specs;
    private int stock;
    private String promotions;
    private List<MultipartFile> image;
    private List<String> category_name;
    private String parent_category;
    private List<String> children_categories;
    private String branch_name;
}
