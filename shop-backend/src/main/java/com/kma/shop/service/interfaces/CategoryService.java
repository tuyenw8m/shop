package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.exception.AppException;

import java.util.List;

public interface CategoryService {
    boolean existsByName(String name);

    CategoryResponse createCategory(CategoryCreationRequest request) throws AppException;

    CategoryResponse toCategoryResponse(CategoryEntity category);

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(String id) throws AppException;

    CategoryResponse getCategoryByName(String name);

    CategoryEntity findByName(String name);

    List<CategoryEntity> findByNames(List<String> names);

    void deleteCategoryById(String id) throws AppException;

    void deleteCategoryByName(String name) throws AppException;

    CategoryResponse updateCategory(String id, CategoryCreationRequest request) throws AppException;
}
