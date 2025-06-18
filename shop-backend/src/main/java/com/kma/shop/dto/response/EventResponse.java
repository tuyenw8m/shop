package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventResponse {
    String id;
    String content;
    LocalDate startDate;
    LocalDate endDate;
    String title;
    List<String> images;
    List<ProductEventResponse> products;
}
