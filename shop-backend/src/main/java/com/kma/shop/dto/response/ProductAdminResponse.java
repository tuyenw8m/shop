package com.kma.shop.dto.response;

import com.kma.shop.enums.EntityStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductAdminResponse {
    private String id;
    private String name;
    private float price;
    private String description;
    private String technical_specs;
    private String highlight_specs;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;
    private int stock;
    private List<String> image_url;
    private List<String> category_name;
    private EntityStatus status;
}
