package com.kma.shop.mapping;

import com.kma.shop.dto.response.ProductAdminResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ImageEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.ProductImageEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductMapping {

    public List<ProductResponse> toProductResponses(List<ProductEntity> entityList){
        return entityList.stream().map(this::toProductResponse).collect(Collectors.toList());
    }

    public ProductResponse toProductResponse(ProductEntity response) {
        return ProductResponse.builder()
                .id(response.getId())
                .highlight_specs(response.getHighlight_specs())
                .technical_specs(response.getTechnical_specs())
                .image_url(response.getImages().stream().map(ProductImageEntity::getUrl).toList())
                .price(response.getPrice())
                .name(response.getName())
                .description(response.getDescription())
                .category_name(response.getCategories().stream().map(CategoryEntity::getName).toList())
                .build();
    }

    public List<ProductAdminResponse> toProductAdminResponses(List<ProductEntity> entityList){
        return entityList.stream().map(this::toProductAdminResponse).collect(Collectors.toList());
    }

    public ProductAdminResponse toProductAdminResponse(ProductEntity response) {
        return ProductAdminResponse.builder()
                .id(response.getId())
                .highlight_specs(response.getHighlight_specs())
                .technical_specs(response.getTechnical_specs())
                .image_url(response.getImages().stream().map(ProductImageEntity::getUrl).toList())
                .price(response.getPrice())
                .name(response.getName())
                .description(response.getDescription())
                .category_name(response.getCategories().stream().map(CategoryEntity::getName).toList())
                .created_at(response.getCreationDate())
                .deleted_at(response.getDeleteDate())
                .updated_at(response.getModifiedDate())
                .status(response.getEntityStatus())
                .build();
    }
}
