package com.kma.shop.service.impl;

import com.kma.shop.dto.request.ReviewCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ReviewResponse;
import com.kma.shop.entity.ImageEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.ReviewEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.ReviewRepo;
import com.kma.shop.service.interfaces.ImageService;
import com.kma.shop.service.interfaces.OrderService;
import com.kma.shop.service.interfaces.UserService;
import com.kma.shop.specification.ReviewSpecification;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService{
    ReviewRepo repo;
    UserService userService;
    ImageService imageService;
    ProductService productService;
    OrderService orderService;

    public ReviewResponse create(String productId, ReviewCreationRequest request) throws AppException {
        if(productId == null || productId.isEmpty()) {
            throw new AppException(ErrorCode.CONFLICT);
        }
        if(!orderService.isOrderedProduct(productId)) {
            throw  new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        UserEntity user = userService.getCurrentUser();
        ProductEntity product = productService.findById(productId);
        List<ImageEntity> savedImages = imageService.saveImages(request.getImages());
        ReviewEntity reviewEntity = ReviewEntity.builder()
                .comment(request.getComment())
                .rating(request.getRating())
                .images(savedImages)
                .product(product)
                .user(user)
                .build();
        return toResponse(repo.save(reviewEntity));
    }

    @Transactional
    public ReviewResponse update(String reviewId, ReviewCreationRequest request) throws AppException {
        // Validate input
        if (reviewId == null || reviewId.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

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

        // Delete existing images and clear the list
        if (reviewEntity.getImages() != null && !reviewEntity.getImages().isEmpty()) {
            imageService.delete(reviewEntity.getImages());
            reviewEntity.getImages().clear(); // Clear to avoid orphaned references
        }

        List<ImageEntity> savedImages = imageService.saveImages(request.getImages());
        if (savedImages != null && !savedImages.isEmpty()) {
            savedImages.forEach(image -> image.setReview(reviewEntity));
            reviewEntity.setImages(savedImages);
        } else {
            reviewEntity.setImages(new ArrayList<>());
        }

        // Update fields
        reviewEntity.setComment(request.getComment());
        reviewEntity.setRating(request.getRating());

        // Save and return
        ReviewEntity savedEntity = repo.save(reviewEntity);
        return toResponse(savedEntity);
    }

//    public ReviewResponse update(String reviewId, ReviewCreationRequest request) throws AppException {
//        if(reviewId == null || reviewId.isEmpty()) {
//            throw new AppException(ErrorCode.CONFLICT);
//        }
//        ReviewEntity reviewEntity = repo.findById(reviewId).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
//        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
//        if(!reviewEntity.getUser().getId().equals(userId)) {
//            throw  new AppException(ErrorCode.NOT_AUTHORIZATION);
//        }
//        imageService.delete(reviewEntity.getImages());
//
//        List<ImageEntity> savedImages = imageService.saveImages(request.getImages());
//
//        reviewEntity.setComment(request.getComment());
//        reviewEntity.setRating(request.getRating());
//
//        reviewEntity.setImages(savedImages == null || savedImages.isEmpty() ? null : savedImages);
//
//        ReviewEntity entity = repo.save(reviewEntity);
//        return  toResponse(entity);
//    }

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
                .pageNumber(result.getNumber() + 1)
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
                .image_url(entity.getImages() == null || entity.getImages().isEmpty() ? null : entity.getImages().stream().map(ImageEntity::getUrl).collect(Collectors.toList()))
                .build();
    }
}
