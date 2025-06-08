package com.kma.shop.service.interfaces;

import com.kma.shop.entity.ImageEntity;
import com.kma.shop.entity.ProductImageEntity;
import com.kma.shop.entity.ReviewImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    void deleteReviewImage(List<ReviewImageEntity> entities);

    void deleteReviewImage(ReviewImageEntity entity);

    void deleteProductImage(List<ProductImageEntity> entities);

    void deleteProductImage(ProductImageEntity entity);

    List<ReviewImageEntity> createReviewImageEntities(List<MultipartFile> files);

    ReviewImageEntity createReviewImageEntity(MultipartFile file);

    List<ProductImageEntity> createProductImageEntities(List<MultipartFile> files);

    ProductImageEntity createProductImageEntity(MultipartFile file);

    String upload(MultipartFile file);

    ImageEntity save(String image);

    List<String> uploads(List<MultipartFile> files);

    List<ImageEntity> saves(List<String> images);

    List<ImageEntity> saveImages(List<MultipartFile> files);

    void delete(List<ImageEntity> images);
}
