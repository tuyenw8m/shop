package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable String id) throws AppException {
        productService.delete(id);
        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> update
            (@PathVariable String id, @ModelAttribute ProductCreationRequest request) throws AppException {
        return ApiResponse.<ProductResponse>builder()
                .data(productService.update(id, request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ApiResponse<ProductResponse> add(@ModelAttribute ProductCreationRequest request)   {
        return ApiResponse.<ProductResponse>builder()
                .data(productService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category_name,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0.0") float min_price,
            @RequestParam(required = false, defaultValue = "99999999999.9") float max_price,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false) String sort_by
            )   {
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .data(productService.find(category_name, search, min_price, max_price, page - 1, limit, sort_by))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable String id) throws AppException {
        return ApiResponse.<ProductResponse>builder()
                .data(productService.getById(id))
                .build();
    }
}
