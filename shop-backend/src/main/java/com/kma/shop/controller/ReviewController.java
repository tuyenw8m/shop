package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.ReviewCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ReviewResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/products/{id}/reviews")
    public ApiResponse<PageResponse<ReviewResponse>> getReviews
            (@PathVariable String id,
             @RequestParam(required = false, defaultValue = "0") int rating,
             @RequestParam(required = false, defaultValue = "") String search,
             @RequestParam(required = false, defaultValue = "1") int page,
             @RequestParam(required = false, defaultValue = "10") int limit) {
        return ApiResponse.<PageResponse<ReviewResponse>>builder()
                .data(reviewService.findAll(id, rating, search, page - 1, limit))
                .build();
    }

    @PostMapping("/products/{id}/reviews")

    public ApiResponse<ReviewResponse> create(@PathVariable String id,
                                              @ModelAttribute ReviewCreationRequest request) throws AppException {
        return ApiResponse.<ReviewResponse>builder()
                .data(reviewService.create(id, request))
                .build();
    }

    @PutMapping("/reviews/{id}")
    public ApiResponse<ReviewResponse> update2(@PathVariable String id,
                                              @ModelAttribute ReviewCreationRequest request) throws AppException {
        ReviewResponse response = reviewService.update(id, request);
        return ApiResponse.<ReviewResponse>builder()
                .data(response)
                .build();
    }

    @PutMapping("/products/{id}/reviews")
    public ApiResponse<ReviewResponse> update(@PathVariable String id,
                                              @ModelAttribute ReviewCreationRequest request) throws AppException {
        ReviewResponse response = reviewService.update(id, request);
        return ApiResponse.<ReviewResponse>builder()
                .data(response)
                .build();
    }

    @DeleteMapping("/reviews/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) throws AppException {
        reviewService.delete(id);
        return ApiResponse.<Void>builder().build();
    }
}
