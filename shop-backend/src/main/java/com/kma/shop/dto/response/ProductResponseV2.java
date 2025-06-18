package com.kma.shop.dto.response;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseV2 {
    private String id;
    private String name;
    private float price;
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
    private float original_price;
    private String promotions;
    private String features;
    private String branch_name;
    private float rating;
}
