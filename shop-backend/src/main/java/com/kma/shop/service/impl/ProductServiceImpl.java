package com.kma.shop.service.impl;

import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductAdminResponse;
import com.kma.shop.dto.response.ProductResponse;
import com.kma.shop.entity.CategoryEntity;
import com.kma.shop.entity.ImageEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.entity.ProductImageEntity;
import com.kma.shop.enums.EntityStatus;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.ProductMapping;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.service.interfaces.CategoryService;
import com.kma.shop.service.interfaces.ImageService;
import com.kma.shop.service.interfaces.ProductService;
import com.kma.shop.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service("productServiceImpl")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    ProductRepo repo;
    CategoryService categoryService;
    ImageService imageService;
    ProductMapping productMapping;
    List<EntityStatus> entityStatus = List.of(EntityStatus.CREATED, EntityStatus.UPDATED);

    //get product response by product id
    @Override
    public ProductResponse getById(String id) throws AppException {
        //check input
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        //get product have status is created or updated
        ProductEntity response = repo.findByIdAndEntityStatusIn(id, entityStatus)
                .orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return productMapping.toProductResponse(response);
    }

    //get product entity by id
    @Override
    public ProductEntity findById(String id) throws AppException {
        //check input
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        //return value
        return repo.findByIdAndEntityStatusIn(id, entityStatus)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    //get product response by name og product
    @Override
    public ProductResponse getByName(String name) throws AppException {
        //check input
        if(name == null || name.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        //return value
        ProductEntity entity = repo.findByNameAndEntityStatusIn(name, entityStatus)
                .orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return productMapping.toProductResponse(entity);
    }

    //find by id
    @Override
    public <T> PageResponse<T> find(String categoryName, String search, float min_price, float max_price,
                                    Integer Page, Integer limit, String sort_by)  {

        //check input
        if(max_price < 0) return null;
        if(Page < 0) Page = 0;
        if(limit < 0) limit = 10;

        //set sort for pageable
        PageRequest pageRequest;
        if(sort_by != null) {
            pageRequest = PageRequest.of(Page, limit, Sort.by(sort_by).descending());
        }
        else{
            pageRequest = PageRequest.of(Page, limit);
        }

        CategoryEntity category = categoryService.findByName(categoryName);

        //get authority to define type of search
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        //If admin pass null and spec will get all, or not pass created and updated for user get
        Specification<ProductEntity> spec = Specification
                .where(ProductSpecification.hasName(search))
                .and(ProductSpecification.hasPriceBetween(min_price, max_price))
                .and(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.hasEntityStatus(isAdmin ? null : entityStatus));
        Page<ProductEntity> response = repo.findAll(spec, pageRequest);

        //build response depend on roles
        List<T> mappedContent = isAdmin
                ? response.getContent().stream()
                .map(p -> (T) productMapping.toProductAdminResponse(p)).toList()
                : response.getContent().stream()
                .map(p -> (T) productMapping.toProductResponse(p)).toList();

        return PageResponse.<T>builder()
                .content(mappedContent)
                .totalElements(response.getTotalElements())
                .totalPages(response.getTotalPages())
                .pageSize(response.getSize())
                .pageNumber(response.getNumber())
                .build();
    }

    //Only ADMIN can add new product
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse create(ProductCreationRequest product)  {
        if(product == null ) return null;

        ProductEntity entity = ProductEntity.builder()
                .name(product.getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .categories(categoryService.findByNames(product.getCategory_name()))
                .description(product.getDescription())
                .highlight_specs(product.getHighlight_specs())
                .technical_specs(product.getTechnical_specs())
                .build();

        //Save image
        List<ProductImageEntity> productImageEntities = imageService.createProductImageEntities(product.getImage());
        for(ProductImageEntity imageEntity : productImageEntities) {
            imageEntity.setProduct(entity);
        }
        entity.setImages(productImageEntities);

        repo.save(entity);
        return productMapping.toProductResponse(entity);
    }

    //Only ADMIN can update info of product
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ProductResponse update(String id, ProductCreationRequest product) throws AppException {
        //check in put
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);
        if(product == null)  throw new AppException(ErrorCode.INVALID_INPUT);

        //Get current product
        ProductEntity entity = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));

        //Set new info for product
        entity.setName(product.getName());
        entity.setPrice(product.getPrice());
        entity.setStock(product.getStock());
//        entity.setCategories(categoryService.findByNames(product.getCategory_name()));
        entity.setDescription(product.getDescription());
        entity.setHighlight_specs(product.getHighlight_specs());
        entity.setTechnical_specs(product.getTechnical_specs());
        entity.setEntityStatus(EntityStatus.UPDATED);

        //Delete old image and add new image
        entity.getImages().clear();
        //Save image
        List<ProductImageEntity> productImageEntities = imageService.createProductImageEntities(product.getImage());
        productImageEntities.forEach(img -> img.setProduct(entity));
        entity.getImages().addAll(productImageEntities);

        //return value
        return productMapping.toProductResponse(repo.save(entity));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public ProductAdminResponse disableProduct(String id) throws AppException {
        //check input
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        //Get product
        ProductEntity product = repo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        //Set entity status for product is DELETED
        product.setEntityStatus(EntityStatus.DELETED);
        product.setDeleteDate(LocalDateTime.now());
        repo.save(product);
        return productMapping.toProductAdminResponse(product);
    }

    //Only admin can delete product, so we can set it is deleted make it invisible from user, but admin can see it
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) throws AppException {
        //check input
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        repo.deleteById(id);
    }
}
