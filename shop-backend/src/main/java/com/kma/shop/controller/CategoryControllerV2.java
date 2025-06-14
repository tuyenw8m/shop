package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.ChildCategoryEntity;
import com.kma.shop.entity.ParentCategoryEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.CategoryServiceV2;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories/v2")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryControllerV2 {
    CategoryServiceV2 categoryServiceV2;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .data(categoryServiceV2.getAll())
                .build();
    }

    @GetMapping("/parent/{id}")
    public ApiResponse<CategoryResponse> getParentById(@PathVariable String id) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryServiceV2.getParentById(id))
                .build();
    }

    @GetMapping("/child/{id}")
    public ApiResponse<CategoryResponse> getChildById(@PathVariable String id) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryServiceV2.getChildById(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/parent")
    public ApiResponse<CategoryResponse> createParent(@RequestBody CategoryCreationRequest category) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryServiceV2.createParent(category))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/child/{id}")
    public ApiResponse<CategoryResponse> createChild(@RequestBody CategoryCreationRequest category,@PathVariable String id) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryServiceV2.createChild(category, id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/parent/{id}")
    public ApiResponse<CategoryResponse> updateParent(@PathVariable String id, @RequestBody CategoryCreationRequest category) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryServiceV2.updateParent(category, id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/child/{id}")
    public ApiResponse<CategoryResponse> updateChild(@PathVariable String id, @RequestBody CategoryCreationRequest category) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryServiceV2.updateChild(category, id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/child/{id}")
    public ApiResponse<Void> deleteChild(@PathVariable String id) throws AppException {
        categoryServiceV2.deleteChildById(id);
        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/parent/{id}")
    public ApiResponse<Void> deleteParent(@PathVariable String id) throws AppException {
        categoryServiceV2.deleteParentById(id);
        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }
}
