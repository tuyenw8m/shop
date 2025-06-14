package com.kma.shop.service.impl;

import com.kma.shop.dto.request.ProductCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductAdminResponse;
import com.kma.shop.dto.response.ProductResponseV2;
import com.kma.shop.entity.*;
import com.kma.shop.enums.EntityStatus;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.ProductMappingV2;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.service.interfaces.BranchService;
import com.kma.shop.service.interfaces.CategoryServiceV2;
import com.kma.shop.service.interfaces.ImageService;
import com.kma.shop.service.interfaces.ProductServiceV2;
import com.kma.shop.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service("productServiceV2Impl")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductServiceV2Impl implements ProductServiceV2 {

    ProductRepo repo;
    CategoryServiceV2 categoryServiceV2;
    ImageService imageService;
    ProductMappingV2 productMappingV2;
    List<EntityStatus> entityStatus = List.of(EntityStatus.CREATED, EntityStatus.UPDATED);
    BranchService branchService;

    public ProductServiceV2Impl(ProductRepo repo,
                                CategoryServiceV2 categoryServiceV2, ImageService imageService,

                                ProductMappingV2 productMappingV2, BranchService branchService) {
        this.repo = repo;
        this.categoryServiceV2 = categoryServiceV2;
        this.imageService = imageService;
        this.productMappingV2 = productMappingV2;
        this.branchService = branchService;
    }

    //get product response by product id
    @Override
    public ProductResponseV2 getById(String id) throws AppException {
        //check input
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        //get product have status is created or updated
        ProductEntity response = repo.findByIdAndEntityStatusIn(id, entityStatus)
                .orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return productMappingV2.toProductResponseV2(response);
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
    public ProductResponseV2 getByName(String name) throws AppException {
        //check input
        if(name == null || name.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        //return value
        ProductEntity entity = repo.findByNameAndEntityStatusIn(name, entityStatus)
                .orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return productMappingV2.toProductResponseV2(entity);
    }

    //find by id
    @Override
    public <T> PageResponse<T> find(List<String> childCategories, String parentCategory, String search, float min_price, float max_price,
                                    Integer Page, Integer limit, String sort_by) throws AppException {

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

        ParentCategoryEntity category = parentCategory == null ? null : categoryServiceV2.findParentByName(parentCategory);
        List<ChildCategoryEntity> childCategoryEntities;
        if (childCategories == null) {
            childCategoryEntities = null;
        } else {
            assert category != null;
            childCategoryEntities = category.getChildCategories().stream()
                    .filter(a -> childCategories.contains(a.getName())).toList();
        }

        //If admin pass null and spec will get all, or not pass created and updated for user get
        Specification<ProductEntity> spec = Specification
                .where(ProductSpecification.hasName(search))
                .and(ProductSpecification.hasPriceBetween(min_price, max_price))
                .and(ProductSpecification.hasParentCategory(category))
//                .and(ProductSpecification.hasChildren(childCategoryEntities))
                .and(ProductSpecification.hasEntityStatus(entityStatus));
        Page<ProductEntity> response = repo.findAll(spec, pageRequest);

        //build response depend on roles
        List<T> mappedContent = response.getContent().stream()
                .map(p -> (T) productMappingV2.toProductResponseV2(p)).toList();

        return PageResponse.<T>builder()
                .content(mappedContent)
                .totalElements(response.getTotalElements())
                .totalPages(response.getTotalPages())
                .pageSize(response.getSize())
                .pageNumber(response.getNumber())
                .build();
    }

    //Only ADMIN can add new product
    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public ProductResponseV2 create(ProductCreationRequest request) throws AppException {
        if(request == null ) throw new AppException(ErrorCode.INVALID_INPUT);
        if(!categoryServiceV2.isSameParent(request.getChildren_categories())) throw new AppException(ErrorCode.INVALID_INPUT);

        ProductEntity entity = ProductEntity.builder()
                .name(request.getName())
                .price(request.getPrice())
                .stock(request.getStock())
                .description(request.getDescription())
                .highlight_specs(request.getHighlight_specs())
                .technical_specs(request.getTechnical_specs())
                .promotions(request.getPromotions())
                .branch(branchService.findByName(request.getBranch_name()))
                .parentCategory(categoryServiceV2.getParentByChild(request.getChildren_categories().getFirst()))
                .childCategories(categoryServiceV2.findChildByNames(request.getChildren_categories()))
                .build();

        //Save image
        List<ProductImageEntity> productImageEntities = imageService.createProductImageEntities(request.getImage());
        for(ProductImageEntity imageEntity : productImageEntities) {
            imageEntity.setProduct(entity);
        }
        entity.setImages(productImageEntities);

        repo.save(entity);
        return productMappingV2.toProductResponseV2(entity);
    }

    //Only ADMIN can update info of product
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Override
    public ProductResponseV2 update(String id, ProductCreationRequest request) throws AppException {
        //check in put
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);
        if(request == null)  throw new AppException(ErrorCode.INVALID_INPUT);
        if(!categoryServiceV2.isSameParent(request.getChildren_categories())) throw new AppException(ErrorCode.INVALID_INPUT);
        //Get current product
        ProductEntity entity = repo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));

        //Set new info for product
        entity.setName(request.getName());
        entity.setPrice(request.getPrice());
        entity.setStock(request.getStock());
//        entity.setCategories(categoryService.findByNames(product.getCategory_name()));
        entity.setDescription(request.getDescription());
        entity.setHighlight_specs(request.getHighlight_specs());
        entity.setTechnical_specs(request.getTechnical_specs());
        entity.setBranch(branchService.findByName(request.getBranch_name()));
        entity.setEntityStatus(EntityStatus.UPDATED);
        entity.setParentCategory(categoryServiceV2.getParentByChild(request.getChildren_categories().getFirst()));
        entity.setChildCategories(categoryServiceV2.findChildByNames(request.getChildren_categories()));
        //Delete old image and add new image
        entity.getImages().clear();
        //Save image
        List<ProductImageEntity> productImageEntities = imageService.createProductImageEntities(request.getImage());
        productImageEntities.forEach(img -> img.setProduct(entity));
        entity.getImages().addAll(productImageEntities);

        //category


        //return value
        return productMappingV2.toProductResponseV2(repo.save(entity));
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
        return productMappingV2.toProductAdminResponse(product);
    }

    //Only admin can delete product, so we can set it is deleted make it invisible from user, but admin can see it
    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public void delete(String id) throws AppException {
        //check input
        if(id == null || id.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);

        repo.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public ProductEntity save(ProductEntity product){
        return repo.save(product);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<ProductEntity> saveAll(List<ProductEntity> productEntities){
        return repo.saveAll(productEntities);
    }

    @Override
    public int count(){
        return Math.toIntExact(repo.count());
    }
    @Override
    public PageResponse<ProductResponseV2> findV2(String name, String parent_category_name, List<String> children_category_name,
                                                  String branch_name, float min_price, float max_price,
                                                  int Page, int limit, String sort_by, String sort_type) throws AppException {

        // Kiểm tra input
        if (max_price < 0) return PageResponse.<ProductResponseV2>builder()
                .content(List.of())
                .totalElements(0)
                .totalPages(0)
                .pageSize(limit)
                .pageNumber(Page)
                .build();

        if (Page < 0) Page = 0;
        if (limit < 0) limit = 10;

        // Xử lý sắp xếp
        PageRequest pageRequest;
        if (sort_by != null && !sort_by.trim().isBlank()) {
            pageRequest = PageRequest.of(Page, limit,
                    "desc".equalsIgnoreCase(sort_type) ?
                            Sort.by(sort_by).descending() :
                            Sort.by(sort_by).ascending());
        } else {
            pageRequest = PageRequest.of(Page, limit);
        }

        // Tìm parent category nếu có
        ParentCategoryEntity category = null;
        if (parent_category_name != null && !parent_category_name.isBlank()) {
            category = categoryServiceV2.findParentByName(parent_category_name.trim());
            if (category == null) return emptyResult(Page, limit); // Không tìm thấy parent
        }

        // Làm sạch danh sách tên child category
        List<String> trimmedChildNames = (children_category_name == null) ? List.of() :
                children_category_name.stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList();

        // Lọc các child category từ parent nếu có
        List<ChildCategoryEntity> childCategoryEntities = null;
        if (!trimmedChildNames.isEmpty()) {
            if (category != null) {
                childCategoryEntities = category.getChildCategories().stream()
                        .filter(c -> trimmedChildNames.contains(c.getName()))
                        .toList();
                if (childCategoryEntities.size() != trimmedChildNames.size()) {
                    return emptyResult(Page, limit); // Có tên con không hợp lệ
                }
            } else {
                return emptyResult(Page, limit); // Truyền tên con nhưng không có parent
            }
        }

        // Tìm branch nếu có
        BranchEntity branchEntity = null;
        if (branch_name != null && !branch_name.trim().isBlank()) {
            branchEntity = branchService.findByName(branch_name.trim());
            if (branchEntity == null) return emptyResult(Page, limit); // Không tìm thấy branch
        }

        // Tạo specification
        Specification<ProductEntity> spec = Specification
                .where(ProductSpecification.hasName(name))
                .and(ProductSpecification.hasPriceBetween(min_price, max_price))
                .and(ProductSpecification.hasParentCategory(category))
                .and(ProductSpecification.hasBranch(branchEntity))
                .and(ProductSpecification.hasAllChildren(childCategoryEntities))
                .and(ProductSpecification.hasEntityStatus(entityStatus));

        Page<ProductEntity> response = repo.findAll(spec, pageRequest);

        List<ProductResponseV2> mappedContent = response.getContent().stream()
                .map(productMappingV2::toProductResponseV2)
                .toList();

        return PageResponse.<ProductResponseV2>builder()
                .content(mappedContent)
                .totalElements(response.getTotalElements())
                .totalPages(response.getTotalPages())
                .pageSize(response.getSize())
                .pageNumber(response.getNumber())
                .build();
    }
    private PageResponse<ProductResponseV2> emptyResult(int page, int size) {
        return PageResponse.<ProductResponseV2>builder()
                .content(List.of())
                .totalElements(0)
                .totalPages(0)
                .pageSize(size)
                .pageNumber(page)
                .build();
    }
}
