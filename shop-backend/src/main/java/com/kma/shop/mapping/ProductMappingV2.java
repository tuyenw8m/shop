package com.kma.shop.mapping;

import com.kma.shop.dto.response.ProductAdminResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.dto.response.ProductResponseV2;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ChildCategoryEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.ProductImageEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductMappingV2  {

    public List<ProductResponseV2> toProductResponsesV2(List<ProductEntity> entityList){
        if(entityList == null || entityList.isEmpty()) return List.of();
        return entityList.stream().map(this::toProductResponseV2).collect(Collectors.toList());
    }

    public ProductResponseV2 toProductResponseV2(ProductEntity response) {
        if(response == null) return null;
        return ProductResponseV2.builder()
                .id(response.getId())
                .rating(response.getRating())
                .highlight_specs(response.getHighlight_specs())
                .technical_specs(response.getTechnical_specs())
                .image_url(response.getImages().stream().map(ProductImageEntity::getUrl).toList())
                .price(response.getPrice())
                .name(response.getName())
                .promotions(response.getPromotions())
                .stock(response.getStock())
                .description(response.getDescription())
                .category_name(response.getCategories().stream().map(CategoryEntity::getName).toList())
                .sold(response.getSold())
                .features(response.getFeatures())
                .original_price(response.getOriginal_price())
                .branch_name(response.getBranch() == null ? null : response.getBranch().getName())
                .parent_category_name(response.getParentCategory() == null ? null : response.getParentCategory().getName())
                .children_category_name(
                        response.getChildCategories() == null ? null : response.getChildCategories().stream().map(ChildCategoryEntity::getName).toList())
                .build();
    }

    public List<ProductAdminResponse> toProductAdminResponses(List<ProductEntity> entityList){
        if(entityList == null || entityList.isEmpty()) return List.of();
        return entityList.stream().map(this::toProductAdminResponse).collect(Collectors.toList());
    }

    public ProductAdminResponse toProductAdminResponse(ProductEntity response) {
        if(response == null) return null;
        return ProductAdminResponse.builder()
                .id(response.getId())
                .highlight_specs(response.getHighlight_specs())
                .technical_specs(response.getTechnical_specs())
                .image_url(response.getImages().stream().map(ProductImageEntity::getUrl).toList())
                .price(response.getPrice())
                .stock(response.getStock())
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
