package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.*;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.ProductService;
import com.kma.shop.service.interfaces.ProductServiceV2;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/v2")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductControllerV2 {

    ProductServiceV2 productServiceV2;

    public ProductControllerV2(@Qualifier("productServiceV2Impl") ProductServiceV2 productServiceV2) {
        this.productServiceV2 = productServiceV2;
    }

    @GetMapping("/top")
    public ApiResponse<PageResponse<ProductResponseV2>> getTopSold(@RequestParam(required = false, defaultValue = "1") int page,
                                                           @RequestParam(required = false, defaultValue = "10") int limit) {
        return ApiResponse.<PageResponse<ProductResponseV2>>builder()
                .data(productServiceV2.getTopSold(page - 1,  limit))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")

    public ApiResponse<ProductResponseV2> update
            (@PathVariable String id, @ModelAttribute ProductCreationRequest request) throws AppException {
        return ApiResponse.<ProductResponseV2>builder()
                .data(productServiceV2.update(id, request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ApiResponse<ProductResponseV2> add(@ModelAttribute ProductCreationRequest request) throws AppException {
        return ApiResponse.<ProductResponseV2>builder()
                .data(productServiceV2.create(request))
                .build();
    }

    @GetMapping
    public  ApiResponse<PageResponse<ProductResponseV2>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false, defaultValue = "0.0") float min_price,
            @RequestParam(required = false, defaultValue = "99999999999.9") float max_price,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "") String sort_by,
            @RequestParam(required = false, defaultValue = "desc") String sort_type,
            @RequestParam(required = false) List<String> children_category_name,
            @RequestParam(required = false, defaultValue = "") String parent_category_name,
            @RequestParam(required = false, defaultValue = "") String branch_name
            ) throws AppException {



        return ApiResponse.<PageResponse<ProductResponseV2>>builder()
                .data(productServiceV2.findV2(name, parent_category_name, children_category_name, branch_name, min_price, max_price, page - 1, limit, sort_by, sort_type))
                .build();
    }


    @GetMapping("/top/week")
    public  ApiResponse<List<TopProductSoldInWeekResponse>> getTopSoldInWeek(
            @RequestParam(required = false) String name,
            @RequestParam(required = false, defaultValue = "0.0") float min_price,
            @RequestParam(required = false, defaultValue = "99999999999.9") float max_price,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "") String sort_by,
            @RequestParam(required = false, defaultValue = "desc") String sort_type,
            @RequestParam(required = false) List<String> children_category_name,
            @RequestParam(required = false, defaultValue = "") String parent_category_name,
            @RequestParam(required = false, defaultValue = "") String branch_name
    ) throws AppException {
        return ApiResponse.<List<TopProductSoldInWeekResponse>>builder()
                .data(productServiceV2.getTopSoldInWeek(children_category_name,parent_category_name, name, min_price, max_price, page - 1, limit, sort_by))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponseV2> getProduct(@PathVariable String id) throws AppException {
        return ApiResponse.<ProductResponseV2>builder()
                .data(productServiceV2.getById(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/disable/{id}")
    public ApiResponse<ProductAdminResponseV2> disableProduct(@PathVariable String id) throws AppException {
        return ApiResponse.<ProductAdminResponseV2>builder()
                .data(productServiceV2.disableProduct(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/enable/{id}")
    public ApiResponse<ProductAdminResponseV2> enableProduct(@PathVariable String id) throws AppException {
        return ApiResponse.<ProductAdminResponseV2>builder()
                .data(productServiceV2.enableProduct(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable String id) throws AppException {
        productServiceV2.delete(id);
        return ApiResponse.<Void>builder()
                .data(null)
                .build();
    }

    @GetMapping("/top/week/v2")
    public  ApiResponse<PageResponse<ProductResponseV2>> getTopSoldInWeekV2(
            @RequestParam(required = false) String name,
            @RequestParam(required = false, defaultValue = "0.0") float min_price,
            @RequestParam(required = false, defaultValue = "99999999999.9") float max_price,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "") String sort_by,
            @RequestParam(required = false, defaultValue = "desc") String sort_type,
            @RequestParam(required = false) List<String> children_category_name,
            @RequestParam(required = false, defaultValue = "") String parent_category_name,
            @RequestParam(required = false, defaultValue = "") String branch_name
    ) throws AppException {
        return ApiResponse.<PageResponse<ProductResponseV2>>builder()
                .data(productServiceV2.getTopSoldInWeekV2(children_category_name,parent_category_name, name, min_price, max_price, page - 1, limit, sort_by))
                .build();
    }
}
