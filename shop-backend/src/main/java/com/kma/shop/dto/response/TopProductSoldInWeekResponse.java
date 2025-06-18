package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopProductSoldInWeekResponse {
        private String id;
        private String name;
        private float price;
        private int stock;
        private String image_url;
        private int sold;
        private float original_price;
        private float rating;
    }

