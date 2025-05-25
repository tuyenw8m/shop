package com.kma.shop.service;

import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.ProductRepo;
import jdk.jfr.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;
    @Autowired
    private CategoryService categoryService;

    private ProductResponse toProductResponse(ProductEntity response) {
        return ProductResponse.builder()
                .price(response.getPrice())
                .name(response.getName())
                .description(response.getDescription())
                .category_name(response.getCategories().stream().map(CategoryEntity::getName).toList())
                .build();
    }

    public ProductResponse getById(String id) throws AppException {
        ProductEntity response = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toProductResponse(response);
    }

    public ProductResponse getByName(String name) throws AppException {
        ProductEntity entity = repo.findByName(name).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toProductResponse(entity);
    }
}
