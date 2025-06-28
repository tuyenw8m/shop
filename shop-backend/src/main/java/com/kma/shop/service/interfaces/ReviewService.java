package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.ReviewCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ReviewResponse;
import com.kma.shop.entity.ReviewEntity;
import com.kma.shop.exception.AppException;
import jakarta.transaction.Transactional;

public interface ReviewService {
    long count();

    //create review for product is ordered
    ReviewResponse create(String productId, ReviewCreationRequest request) throws AppException;

    @Transactional
    ReviewResponse update(String reviewId, ReviewCreationRequest request) throws AppException;

    void delete(String reviewId) throws AppException;

    PageResponse<ReviewResponse> findAll(String productId, int rating, String search, int page, int limit);

    ReviewResponse toResponse(ReviewEntity entity);
}
