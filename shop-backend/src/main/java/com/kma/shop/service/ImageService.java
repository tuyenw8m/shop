package com.kma.shop.service;

import com.kma.shop.entity.ImageEntity;
import com.kma.shop.repo.ImageRepo;
import com.kma.shop.utils.Amazon3SUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageService {
    @Autowired
    private ImageRepo repo;

    @Autowired
    private Amazon3SUtils amazonS3Utils;

    public String upload(MultipartFile file) {
        return amazonS3Utils.addImageS3(file);
    }

    public ImageEntity save(String image){
        return repo.save(ImageEntity.builder()
                        .url(image)
                .build());
    }

    public List<String> uploads(List<MultipartFile> files) {
        return files.stream().map(this::upload).collect(Collectors.toList());
    }

    public List<ImageEntity> saves(List<String> images) {
        return images.stream().map(this::save).collect(Collectors.toList());
    }

    public List<ImageEntity> saveImages(List<MultipartFile> files) {
        List<String> images = uploads(files);
        return saves(images);
    }

    public void delete(List<ImageEntity> images) {
        repo.deleteAll(images);
    }
}
