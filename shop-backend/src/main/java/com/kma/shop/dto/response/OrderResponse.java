package com.kma.shop.dto.response;

import com.kma.shop.enums.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    private String id;
    private String user_id;
    private String product_id;
    private float total_price;
    private Status status;
    private int items_count;
    private LocalDateTime created_at;
    private float price;
}
