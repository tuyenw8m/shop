package com.kma.shop.service;

import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo repo;

    public boolean existsByName(String name) {
        return repo.existsByName(name);
    }

    public CategoryResponse createCategory(CategoryCreationRequest request) throws AppException {
        if(!existsByName(request.getName())){
            throw new AppException(ErrorCode.CONFLICT);
        }
        CategoryEntity category = CategoryEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        category = repo.save(category);
        return toCategoryResponse(category);
    }

    private CategoryResponse toCategoryResponse(CategoryEntity category){
        return CategoryResponse.builder()
                .description(category.getDescription())
                .name(category.getName())
                .id(category.getId())
                .build();
    }

    public List<CategoryResponse> getAllCategories(){
        List<CategoryEntity> list = repo.findAll();
        return list.stream().map(this::toCategoryResponse).collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(String id) throws AppException {
        CategoryEntity category = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toCategoryResponse(category);
    }

    public CategoryResponse getCategoryByName(String name) {
        CategoryEntity category = repo.findByName(name);
        return toCategoryResponse(category);
    }

    public CategoryEntity findByName(String name) {
        return repo.findByName(name);
    }

    public List<CategoryEntity> findByNames(List<String> names) {
        return names.stream().map(this::findByName).collect(Collectors.toList());
    }

    public void deleteCategoryById(String id) throws AppException {
        repo.deleteById(id);
    }

    public void deleteCategoryByName(String name) throws AppException {
        repo.deleteByName(name);
    }

    public CategoryResponse updateCategory(String id, CategoryCreationRequest request) throws AppException {
        CategoryEntity category = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category = repo.save(category);
        return toCategoryResponse(category);
    }
}
