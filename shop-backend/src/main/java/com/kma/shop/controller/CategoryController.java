package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .data(categoryService.getAllCategories())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(@PathVariable String id) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.getCategoryById(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<CategoryResponse> create(@RequestBody CategoryCreationRequest category) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.createCategory(category))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> update(@PathVariable String id, @RequestBody CategoryCreationRequest category) throws AppException {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.updateCategory(id, category))
                .build();
    }


}
