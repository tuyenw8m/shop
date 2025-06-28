package com.kma.shop.service.impl;

import com.kma.shop.dto.request.ReviewCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ReviewResponse;
import com.kma.shop.entity.*;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.ReviewRepo;
import com.kma.shop.service.interfaces.*;
import com.kma.shop.specification.ReviewSpecification;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewServiceImpl implements ReviewService{
    ReviewRepo repo;
    UserService userService;
    ImageService imageService;
    ProductServiceV2 productServiceV2;
    OrderService orderService;

    public ReviewServiceImpl(ReviewRepo repo, UserService userService, ImageService imageService,
                             ProductServiceV2 productServiceV2, OrderService orderService) {
        this.repo = repo;
        this.userService = userService;
        this.imageService = imageService;
        this.productServiceV2 = productServiceV2;
        this.orderService = orderService;
    }

    @Override
    public long count(){
        return repo.count();
    }

    //create review for product is ordered
    @Override
    @Transactional
    public ReviewResponse create(String productId, ReviewCreationRequest request) throws AppException {

        //check input
        if(productId == null || productId.isEmpty()) {
            throw new AppException(ErrorCode.CONFLICT);
        }

        //just ordered product is commented
        if(!orderService.isOrderedProductByProductId(productId)) {
            throw  new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        //get user and product
        UserEntity user = userService.getCurrentUser();
        ProductEntity product = productServiceV2.findById(productId);
        int rating = product.getRating();
        product.setRating((rating * product.getReviews().size() + request.getRating())/(product.getReviews().size() + 1));
        ReviewEntity reviewEntity = ReviewEntity.builder()
                .comment(request.getComment())
                .rating(request.getRating())
                .images(new ArrayList<>())
                .product(product)
                .user(user)
                .build();
        user.getReviews().add(reviewEntity);
        product.getReviews().add(reviewEntity);

        //upload image and add review entity for image entity
        //Save image
        if(request.getImages() != null && !request.getImages().isEmpty()) {
            List<ReviewImageEntity> newImage = imageService.createReviewImageEntities(request.getImages());
            for(ReviewImageEntity imageEntity : newImage) {
                imageEntity.setReview(reviewEntity);
            }
            reviewEntity.getImages().addAll(newImage);
        }

        //return after update
        return toResponse(repo.save(reviewEntity));
    }

    @Override
    @Transactional
    public ReviewResponse update(String reviewId, ReviewCreationRequest request) throws AppException {
        if (reviewId == null || reviewId.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }
        if(request == null ) throw new AppException(ErrorCode.INVALID_INPUT);

        // Fetch review with images to avoid lazy loading issues
        ReviewEntity reviewEntity = repo.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));

        // Check authorization
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!reviewEntity.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.NOT_AUTHORIZATION);
        }

        // Validate request data
        if (request.getRating() < 1 || request.getRating() > 5) { // Example range validation
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        if(request.getRating() != reviewEntity.getRating()) {
            ProductEntity product = reviewEntity.getProduct();
            int rating = (product.getRating() * product.getReviews().size() + request.getRating() - reviewEntity.getRating())
                    /product.getReviews().size();
            product.setRating(rating);
        }

        // Xóa ảnh cũ (orphanRemoval sẽ lo phần còn lại)
        reviewEntity.getImages().clear();

        //Save image
        List<ReviewImageEntity> newImage = imageService.createReviewImageEntities(
                request.getImages() == null ? null :request.getImages());
        newImage.forEach(img -> img.setReview(reviewEntity));
        reviewEntity.getImages().addAll(newImage);

        // Update fields
        reviewEntity.setComment(request.getComment());
        reviewEntity.setRating(request.getRating());

        // Save and return
        return toResponse(repo.save(reviewEntity));
    }

    @Override
    public void delete(String reviewId) throws AppException {
        if(reviewId == null || reviewId.isEmpty()) {
            throw new AppException(ErrorCode.CONFLICT);
        }
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userService.findUserById(userId);
        ReviewEntity reviewEntity = repo.findById(reviewId).orElseThrow(() ->new AppException(ErrorCode.CONFLICT));
        ProductEntity product = reviewEntity.getProduct();
        int rating = (product.getRating() * product.getReviews().size()  - reviewEntity.getRating())
                /(product.getReviews().size() - 1);
        product.setRating(rating);
        if(reviewEntity.getUser() != user) {
            throw  new AppException(ErrorCode.NOT_AUTHENTICATION);
        }
        repo.delete(reviewEntity);
    }

    @Override
    public PageResponse<ReviewResponse> findAll(String productId, int rating, String search, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Specification<ReviewEntity> spec = Specification.where(ReviewSpecification.hasRating(rating))
                .and(ReviewSpecification.hasComment(search))
                .and(ReviewSpecification.hasProductId(productId));
        Page<ReviewEntity> result = repo.findAll(spec, pageable);
        return PageResponse.<ReviewResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .pageNumber(result.getNumber() + 1)
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }
    @Override
    public ReviewResponse toResponse(ReviewEntity entity) {
        return ReviewResponse.builder()
                .comment(entity.getComment())
                .id(entity.getId())
                .rating(entity.getRating())
                .created_at(entity.getCreationDate())
                .product_id(entity.getProduct().getId())
                .user_id(entity.getUser().getId())
                .user_name(entity.getUser().getName())
                .image_url(entity.getImages() == null || entity.getImages().isEmpty() ? null : entity.getImages().stream().map(ReviewImageEntity::getUrl).collect(Collectors.toList()))
                .build();
    }
}
