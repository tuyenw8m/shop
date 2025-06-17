package com.kma.shop.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventCreationRequest {
    String content;
    LocalDate startDate;
    LocalDate endDate;
    String title;
    List<MultipartFile> images;
    List<ProductPromotionRequest> products;
    List<CategoryPromotionRequest> categories;
    List<BranchPromotionRequest> branches;

}
