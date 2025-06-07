package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductAdminResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.exception.AppException;
import org.springframework.security.access.prepost.PreAuthorize;

public interface ProductService {
    //get product response by product id
    ProductResponse getById(String id) throws AppException;

    //get product entity by id
    ProductEntity findById(String id) throws AppException;

    //get product response by name og product
    ProductResponse getByName(String name) throws AppException;

    //find by id
    <T> PageResponse<T> find(String categoryName, String search, float min_price, float max_price,
                            Integer Page, Integer limit, String sort_by);

    ProductResponse create(ProductCreationRequest product);

    ProductResponse update(String id, ProductCreationRequest product) throws AppException;

    @PreAuthorize("hasRole('ADMIN')")
    ProductAdminResponse disableProduct(String id) throws AppException;

    //Only admin can delete product, so we can set it is deleted make it invisible from user, but admin can see it
    void delete(String id) throws AppException;
}
