package com.kma.shop.service.impl;

import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.CategoryRepo;
import com.kma.shop.service.interfaces.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepo repo;

    @Override
    public boolean existsByName(String name) {
        return repo.existsByName(name);
    }
    @Override
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
    @Override
    public CategoryResponse toCategoryResponse(CategoryEntity category){
        return CategoryResponse.builder()
                .description(category.getDescription())
                .name(category.getName())
                .id(category.getId())
                .build();
    }
    @Override
    public List<CategoryResponse> getAllCategories(){
        List<CategoryEntity> list = repo.findAll();
        return list.stream().map(this::toCategoryResponse).collect(Collectors.toList());
    }
    @Override
    public CategoryResponse getCategoryById(String id) throws AppException {
        CategoryEntity category = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toCategoryResponse(category);
    }
    @Override
    public CategoryResponse getCategoryByName(String name) {
        CategoryEntity category = repo.findByName(name);
        return toCategoryResponse(category);
    }
    @Override
    public CategoryEntity findByName(String name) {
        return repo.findByName(name);
    }
    @Override
    public List<CategoryEntity> findByNames(List<String> names) {
        return names.stream().map(this::findByName).collect(Collectors.toList());
    }
    @Override
    public void deleteCategoryById(String id) throws AppException {
        repo.deleteById(id);
    }
    @Override
    public void deleteCategoryByName(String name) throws AppException {
        repo.deleteByName(name);
    }
    @Override
    public CategoryResponse updateCategory(String id, CategoryCreationRequest request) throws AppException {
        CategoryEntity category = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category = repo.save(category);
        return toCategoryResponse(category);
    }
}
