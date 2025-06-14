package com.kma.shop.mapping;

import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.BranchEntity;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ChildCategoryEntity;
import com.kma.shop.entity.ParentCategoryEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapping {
    public CategoryResponse toCategoryResponse(CategoryEntity category){
        if(category == null) return null;
        return CategoryResponse.builder()
                .description(category.getDescription())
                .name(category.getName())
                .id(category.getId())
                .build();
    }

    public List<CategoryResponse> toCategoryResponseList(List<CategoryEntity> categoryList){
        if(categoryList == null || categoryList.isEmpty()) return List.of();
        return categoryList.stream().map(this::toCategoryResponse).collect(Collectors.toList());
    }

    public CategoryResponse toChildCategoryResponse(ChildCategoryEntity category){
        if(category == null) return null;
        return CategoryResponse.builder()
                .description(category.getDescription())
                .name(category.getName())
                .branch_name(category.getBranches().stream().map(BranchEntity::getName).toList())
                .id(category.getId())
                .build();
    }

    public List<CategoryResponse> toChildCategoryResponseList(List<ChildCategoryEntity> categoryList){
        if(categoryList == null || categoryList.isEmpty()) return List.of();
        return categoryList.stream().map(this::toChildCategoryResponse).toList();
    }

    public CategoryResponse toParentCategoryResponse(ParentCategoryEntity category){
        if(category == null) return null;
        return CategoryResponse.builder()
                .description(category.getDescription())
                .name(category.getName())
                .id(category.getId())
                .children(toChildCategoryResponseList(category.getChildCategories()))
                .build();
    }

    public ParentCategoryEntity toParentCategoryEntity(CategoryCreationRequest request){
        if(request == null) return null;
        return ParentCategoryEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public ChildCategoryEntity toChildCategoryEntity(CategoryCreationRequest request, ParentCategoryEntity parentCategory){
        if(request == null || parentCategory == null) return null;
        return ChildCategoryEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .parent(parentCategory)
                .build();
    }
}
