package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CartItemResponse {
    String item_id;
    String product_id;
    String name;
    float price;
    int quantity;
    List<String> image_url;
}
