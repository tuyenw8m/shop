package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductAdminResponseV2;
import com.kma.shop.dto.response.ProductResponseV2;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.exception.AppException;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface ProductServiceV2 {
    //get product response by product id
    ProductResponseV2 getById(String id) throws AppException;

    //get product entity by id
    ProductEntity findById(String id) throws AppException;

    //get product response by name og product
    ProductResponseV2 getByName(String name) throws AppException;

    //find by id
    <T> PageResponse<T> find(List<String> childCategories, String parentCategory, String search,
                             float min_price, float max_price,
                             Integer Page, Integer limit, String sort_by) throws AppException;

    PageResponse<ProductResponseV2> getTopSold(int page, int limit);

    boolean existsByName(String name);

    //Only ADMIN can add new product
    @PreAuthorize("hasRole('ADMIN')")
    ProductResponseV2 create(ProductCreationRequest request) throws AppException;

    boolean existsById(String id);

    //Only ADMIN can update info of product
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    ProductResponseV2 update(String id, ProductCreationRequest request) throws AppException;

    @PreAuthorize("hasRole('ADMIN')")
    ProductAdminResponseV2 disableProduct(String id) throws AppException;

    @PreAuthorize("hasRole('ADMIN')")
    ProductAdminResponseV2 enableProduct(String id) throws AppException;

    //Only admin can delete product, so we can set it is deleted make it invisible from user, but admin can see it
    @PreAuthorize("hasRole('ADMIN')")
    void delete(String id) throws AppException;

    @PreAuthorize("hasRole('ADMIN')")
    ProductEntity save(ProductEntity product);

    @PreAuthorize("hasRole('ADMIN')")
    List<ProductEntity> saveAll(List<ProductEntity> productEntities);

    int count();


    <T> PageResponse<T> findV2(String name, String parent_category_name, List<String> children_category_name,
                               String branch_name, float min_price, float max_price,
                               int Page, int limit, String sort_by, String sort_type) throws AppException;
}
