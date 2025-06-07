package com.kma.shop.service.interfaces;

import com.kma.shop.entity.ImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    String upload(MultipartFile file);

    ImageEntity save(String image);

    List<String> uploads(List<MultipartFile> files);

    List<ImageEntity> saves(List<String> images);

    List<ImageEntity> saveImages(List<MultipartFile> files);

    void delete(List<ImageEntity> images);
}
