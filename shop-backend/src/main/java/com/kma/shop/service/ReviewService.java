package com.kma.shop.service;

import com.kma.shop.dto.request.ReviewCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ReviewResponse;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.ReviewEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.ReviewRepo;
import com.kma.shop.specification.ReviewSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService{
    @Autowired
    private ReviewRepo repo;
    @Autowired
    private UserService userService;
    @Autowired
    private ImageService imageService;
    @Autowired
    private ProductService productService;
    @Autowired
    private UserOrderProductService userOrderProductService;

    public ReviewResponse create(String productId, ReviewCreationRequest request) throws AppException {
        if(productId == null || productId.isEmpty()) {
            throw new AppException(ErrorCode.CONFLICT);
        }
        if(!userOrderProductService.isOrdered(productId)) {
            throw  new AppException(ErrorCode.CONFLICT);
        }
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        ProductEntity product = productService.findById(productId);
        ReviewEntity reviewEntity = ReviewEntity.builder()
                .comment(request.getComment())
                .rating(request.getRating())
                .images(imageService.saveImages(request.getImages()))
                .product(product)
                .user(user)
                .build();
        return toResponse(repo.save(reviewEntity));
    }

    public ReviewResponse update(String reviewId, ReviewCreationRequest request) throws AppException {
        if(reviewId == null || reviewId.isEmpty()) {
            throw new AppException(ErrorCode.CONFLICT);
        }
        ReviewEntity reviewEntity = repo.findById(reviewId).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!reviewEntity.getUser().getId().equals(userId)) {
            throw  new AppException(ErrorCode.NOT_AUTHORIZATION);
        }
        reviewEntity.setComment(request.getComment());
        reviewEntity.setRating(request.getRating());
        reviewEntity.setImages(imageService.saveImages(request.getImages()));
        return toResponse(repo.save(reviewEntity));
    }

    public void delete(String reviewId) throws AppException {
        if(reviewId == null || reviewId.isEmpty()) {
            throw new AppException(ErrorCode.CONFLICT);
        }
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        ReviewEntity reviewEntity = repo.findById(reviewId).orElseThrow(() ->new AppException(ErrorCode.CONFLICT));
        if(reviewEntity.getUser() != user) {
            throw  new AppException(ErrorCode.NOT_AUTHENTICATION);
        }
        repo.delete(reviewEntity);
    }


    public PageResponse<ReviewResponse> findAll(String productId, int rating, String search, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Specification<ReviewEntity> spec = Specification.where(ReviewSpecification.hasRating(rating))
                .and(ReviewSpecification.hasComment(search))
                .and(ReviewSpecification.hasProductId(productId));
        Page<ReviewEntity> result = repo.findAll(spec, pageable);
        return PageResponse.<ReviewResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .pageNumber(result.getNumber())
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    public ReviewResponse toResponse(ReviewEntity entity) {
        return ReviewResponse.builder()
                .comment(entity.getComment())
                .id(entity.getId())
                .rating(entity.getRating())
                .created_at(LocalDate.from(entity.getCreationDate()))
                .product_id(entity.getProduct().getId())
                .user_id(entity.getUser().getId())
                .user_name(entity.getUser().getName())
                .build();
    }
}
