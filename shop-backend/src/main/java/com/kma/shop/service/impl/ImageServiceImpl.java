package com.kma.shop.service.impl;

import com.kma.shop.entity.ImageEntity;
import com.kma.shop.entity.ProductImageEntity;
import com.kma.shop.entity.ReviewImageEntity;
import com.kma.shop.repo.ImageRepo;
import com.kma.shop.repo.ProductImageRepo;
import com.kma.shop.repo.ReviewImageRepo;
import com.kma.shop.service.interfaces.ImageService;
import com.kma.shop.utils.Amazon3SUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class ImageServiceImpl implements ImageService {
    ImageRepo repo;
    Amazon3SUtils amazonS3Utils;
    ProductImageRepo productImageRepo;
    ReviewImageRepo reviewImageRepo;

    @Override
    public void deleteReviewImage(List<ReviewImageEntity> entities){
        entities.forEach(this::deleteReviewImage);
    }

    @Override
    public void deleteReviewImage(ReviewImageEntity entity){
        reviewImageRepo.delete(entity);
    }

    @Override
    public void deleteProductImage(List<ProductImageEntity> entities){
        entities.forEach(this::deleteProductImage);
    }

    @Override
    public void deleteProductImage(ProductImageEntity entity){
        productImageRepo.delete(entity);
    }

    @Override
    public List<ReviewImageEntity> createReviewImageEntities(List<MultipartFile> files){
        if(files == null || files.isEmpty()) return List.of();
        return files.stream().map(this::createReviewImageEntity).collect(Collectors.toList());
    }

    @Override
    public ReviewImageEntity createReviewImageEntity(MultipartFile file){
        if(file == null || file.isEmpty()) return null;
        return ReviewImageEntity.builder()
                .url(upload(file))
                .build();
    }

    @Override
    public List<ProductImageEntity> createProductImageEntities(List<MultipartFile> files){
        if(files == null || files.isEmpty()) return List.of();
        return files.stream().map(this::createProductImageEntity).collect(Collectors.toList());
    }

    @Override
    public ProductImageEntity createProductImageEntity(MultipartFile file){
        if(file == null || file.isEmpty()) return null;
        return ProductImageEntity.builder()
                .url(upload(file))
                .build();
    }

    @Override
    public String upload(MultipartFile file) {
        return amazonS3Utils.addImageS3(file);
    }
    @Override
    public ImageEntity save(String image){
        return ImageEntity.builder()
                        .url(image)
                .build();
    }
    @Override
    public List<String> uploads(List<MultipartFile> files) {
        return files.stream().map(this::upload).collect(Collectors.toList());
    }
    @Override
    public List<ImageEntity> saves(List<String> images) {
        return images.stream().map(this::save).collect(Collectors.toList());
    }
    @Override
    public List<ImageEntity> saveImages(List<MultipartFile> files) {
        if(files == null || files.isEmpty()) return List.of();
        List<String> images = uploads(files);
        return saves(images);
    }
    @Override
    public void delete(List<ImageEntity> images) {
        if(images == null || images.isEmpty()) return;
        repo.deleteAll(images);
    }
}
