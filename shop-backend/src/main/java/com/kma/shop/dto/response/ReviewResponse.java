package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {

    String id;
    String product_id;
    String user_id;
    String user_name;
    int rating;
    String comment;
    LocalDateTime created_at;
    List<String> image_url;
}
