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
public class CartResponse {
    float total_price;
    int total_items;
    String user_id;
    List<CartItemResponse> items;
}
