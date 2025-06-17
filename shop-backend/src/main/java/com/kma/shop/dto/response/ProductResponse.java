package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private float price;
    private String description;
    private String technical_specs;
    private String highlight_specs;
    private int stock;
    private List<String> image_url;
    private List<String> category_name;
}
