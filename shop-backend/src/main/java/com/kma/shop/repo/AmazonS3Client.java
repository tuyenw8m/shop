package com.kma.shop.repo;


import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Random;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AmazonS3Client {

    @Value("${amazon.bucket-name}")
    String bucket;
    @Value("${amazon.region}")
    String region;
    final S3Client s3Client; // Inject vào constructor

    @Autowired
    public AmazonS3Client(S3Client s3Client) {
        this.s3Client = s3Client;
    }
    public String uploadFile(MultipartFile file) {
        String key = file.getOriginalFilename();
        Random rand = new Random();
        int randomNumber = rand.nextInt(900) + 100; // Tạo số từ 100 đến 999
        key += String.valueOf(randomNumber);
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
        return generateFileUrl(key);
    }

    private String generateFileUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key);
    }
}
