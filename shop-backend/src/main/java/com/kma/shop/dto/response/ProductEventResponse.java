package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductEventResponse {
    String productId;
    String productName;
    float price;
    float promotionPrice;
    float promotionPercent;
}
