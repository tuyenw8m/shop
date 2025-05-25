package com.kma.shop.service;

import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.ProductRepo;
import jdk.jfr.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ImageService imageService;

    private ProductResponse toProductResponse(ProductEntity response) {
        return ProductResponse.builder()
                .price(response.getPrice())
                .name(response.getName())
                .description(response.getDescription())
                .category_name(response.getCategories().stream().map(CategoryEntity::getName).toList())
                .build();
    }

    public ProductResponse getById(String id) throws AppException {
        ProductEntity response = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toProductResponse(response);
    }

    public ProductResponse getByName(String name) throws AppException {
        ProductEntity entity = repo.findByName(name).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return toProductResponse(entity);
    }

    public PageResponse<ProductResponse> find
            (List<String> categoryName, String search, float min_price, float max_price,
             Integer Page, Integer limit, String sort_by)  {
        List<CategoryEntity> categories = categoryService.findByNames(categoryName);
        PageRequest pageRequest = PageRequest.of(Page, limit, Sort.by(sort_by).descending());
        Page<ProductEntity> response = repo.findByCategoriesAndPriceBetween(categories, min_price, max_price, pageRequest);
        return PageResponse.<ProductResponse>builder()
                .content(response.getContent().stream().map(this::toProductResponse).toList())
                .totalElements(response.getTotalElements())
                .totalPages(response.getTotalPages())
                .pageSize(response.getSize())
                .pageNumber(response.getNumber())
                .build();
    }

    public ProductResponse create(ProductCreationRequest product)  {
        ProductEntity entity = ProductEntity.builder()
                .name(product.getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .categories(categoryService.findByNames(product.getCategories_name()))
                .description(product.getDescription())
                .highlight_specs(product.getHighlight_specs())
                .technical_specs(product.getTechnical_specs())
                .image(imageService.saveImages(product.getImage()))
                .build();
        repo.save(entity);
        return toProductResponse(entity);
    }

    public ProductResponse update(String id, ProductCreationRequest product) throws AppException {
        ProductEntity entity = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        entity.setName(product.getName());
        entity.setPrice(product.getPrice());
        entity.setStock(product.getStock());
        entity.setCategories(categoryService.findByNames(product.getCategories_name()));
        entity.setDescription(product.getDescription());
        entity.setHighlight_specs(product.getHighlight_specs());
        entity.setTechnical_specs(product.getTechnical_specs());
        imageService.delete(entity.getImage());
        entity.setImage(imageService.saveImages(product.getImage()));
        repo.save(entity);
        return toProductResponse(entity);
    }

    public void delete(String id) throws AppException {
        repo.deleteById(id);
    }
}
