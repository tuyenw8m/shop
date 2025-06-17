package com.kma.shop.dto.response;

import com.kma.shop.enums.EntityStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductAdminResponseV2 {
    private String id;
    private String name;
    private float price;
    private float original_price;
    private float promotion_price;
    private float promotion_percent;
    private String description;
    private String technical_specs;
    private String highlight_specs;
    private int stock;
    private List<String> image_url;
    private String parent_category_name;
    private List<String> children_category_name;
    private List<String> category_name;
    private int sold;
    private String promotions;
    private String features;
    private String branch_name;
    private float rating;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;
    private EntityStatus status;
}
