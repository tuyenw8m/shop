package com.kma.shop.service.impl;

import com.kma.shop.entity.ImageEntity;
import com.kma.shop.repo.ImageRepo;
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

    @Override
    public String upload(MultipartFile file) {
        return amazonS3Utils.addImageS3(file);
    }
    @Override
    public ImageEntity save(String image){
        return repo.save(ImageEntity.builder()
                        .url(image)
                .build());
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
