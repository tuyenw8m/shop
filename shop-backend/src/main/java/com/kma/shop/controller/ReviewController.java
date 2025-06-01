package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.ReviewCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ReviewResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.ReviewService;
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
                .data(reviewService.findAll(id, rating, search, page, limit))
                .build();
    }

    @PostMapping("/products/{id}/reviews")
    public ApiResponse<ReviewResponse> create(@PathVariable String id,
                                              @ModelAttribute ReviewCreationRequest request) throws AppException {
        return ApiResponse.<ReviewResponse>builder()
                .data(reviewService.create(id, request))
                .build();
    }

    @PutMapping("/products/{id}/reviews")
    public ApiResponse<ReviewResponse> update(@PathVariable String id,
                                              @ModelAttribute ReviewCreationRequest request) throws AppException {
        return ApiResponse.<ReviewResponse>builder()
                .data(reviewService.update(id, request))
                .build();
    }

    @DeleteMapping("/reviews/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) throws AppException {
        reviewService.delete(id);
        return ApiResponse.<Void>builder().build();
    }
}
