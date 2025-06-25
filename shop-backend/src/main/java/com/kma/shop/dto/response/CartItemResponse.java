package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String item_id;
    String product_id;
    String name;
    float price;
    float total_price;
    int quantity;
    List<String> image_url;
}
