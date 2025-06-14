package com.kma.shop.service.impl;

import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.ChildCategoryEntity;
import com.kma.shop.entity.ParentCategoryEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.CategoryMapping;
import com.kma.shop.repo.ChildCategoryRepo;
import com.kma.shop.repo.ParentCategoryRepo;
import com.kma.shop.repo.ProductRepo;
import com.kma.shop.service.interfaces.BranchService;
import com.kma.shop.service.interfaces.CategoryServiceV2;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service("category_service_v2_impl")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceV2Impl  implements CategoryServiceV2 {
    ParentCategoryRepo parentRepo;
    ChildCategoryRepo childRepo;
    CategoryMapping categoryMapping;
    BranchService branchService;
    private final ProductRepo productRepo;

    @Override
    public List<CategoryResponse> getAll(){
        List<ParentCategoryEntity> list = parentRepo.findAll();
        return list.stream().map(categoryMapping::toParentCategoryResponse).toList();
    }

    @Override
    public CategoryResponse createParent(CategoryCreationRequest request) throws AppException {
        if(request == null) return null;
        if(parentRepo.existsByName(request.getName())) throw new AppException(ErrorCode.CATEGORY_EXISTED);
        ParentCategoryEntity categoryEntity = categoryMapping.toParentCategoryEntity(request);
        return categoryMapping.toParentCategoryResponse(parentRepo.save(categoryEntity));
    }


    @Override
    public CategoryResponse createChild(CategoryCreationRequest request, String id) throws AppException {
        if(request == null || id == null || id.isEmpty())
            throw new AppException(ErrorCode.INVALID_INPUT);

        ParentCategoryEntity parent = parentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        ChildCategoryEntity childCategoryEntity = categoryMapping.toChildCategoryEntity(request, parent);

        if(!branchService.existsAllByName(request.getBranch_names()))
            throw new AppException(ErrorCode.INVALID_INPUT);

        childCategoryEntity.setBranches(branchService.findByNames(request.getBranch_names()));
        return categoryMapping.toChildCategoryResponse(childRepo.save(childCategoryEntity));
    }

    @Override
    public CategoryResponse updateChild(CategoryCreationRequest request, String id) throws AppException {
        ChildCategoryEntity child = childRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        child.setName(request.getName());
        child.setDescription(request.getDescription());
        if(!branchService.existsAllByName(request.getBranch_names()))
            throw new AppException(ErrorCode.INVALID_INPUT);

        child.setBranches(branchService.findByNames(request.getBranch_names()));

        return categoryMapping.toChildCategoryResponse(childRepo.save(child));
    }

    @Override
    public CategoryResponse updateParent(CategoryCreationRequest request, String id) throws AppException {
        ParentCategoryEntity parent = parentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        parent.setName(request.getName());
        parent.setDescription(request.getDescription());
        return categoryMapping.toParentCategoryResponse(parentRepo.save(parent));
    }

    @Override
    public void deleteChildById(String id) throws AppException {
        if(id == null || id.isEmpty()) throw new AppException(ErrorCode.INVALID_INPUT);
        childRepo.deleteById(id);
    }

    @Override
    public void deleteParentById(String id) throws AppException {
        if(id == null || id.isEmpty()) throw new AppException(ErrorCode.INVALID_INPUT);
        ParentCategoryEntity parentCategory = findParentById(id);
        if( parentCategory.getChildCategories() != null && parentCategory.getProducts() != null
            && !parentCategory.getChildCategories().isEmpty() && !parentCategory.getProducts().isEmpty()){
            throw new AppException(ErrorCode.CATEGORY_CANNOT_DELETE);
        }
        parentRepo.deleteById(id);
    }

    @Override
    public ChildCategoryEntity findChildById(String id) throws AppException {
        if(id == null || id.isEmpty()) return null;
        return childRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }


    @Override
    public CategoryResponse getChildById(String id) throws AppException {
        if(id == null || id.isEmpty()) return null;
        return categoryMapping.toChildCategoryResponse(findChildById(id));
    }

    @Override
    public CategoryResponse getParentById(String id) throws AppException {
        if(id == null || id.isEmpty()) return null;
        return categoryMapping.toParentCategoryResponse(findParentById(id));
    }

    @Override
    public ParentCategoryEntity findParentById(String id) throws AppException {
        if(id == null || id.isEmpty()) return null;
        return parentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }


    @Override
    public ParentCategoryEntity findParentByName(String name) throws AppException {
        if (name == null || name.isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        return parentRepo.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public ChildCategoryEntity findChildByName(String name) throws AppException {
        if (name == null || name.isBlank()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        return childRepo.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public List<ParentCategoryEntity> findParentByNames(List<String> names) throws AppException {
        if (names == null || names.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        return names.stream()
                .map(name -> {
                    try {
                        return findParentByName(name);
                    } catch (AppException ex) {
                        // Ghi log nếu cần thiết
                        return null; // hoặc có thể bỏ qua
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }

    @Override
    public List<ChildCategoryEntity> findChildByNames(List<String> names) throws AppException {
        if (names == null || names.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        return names.stream()
                .map(name -> {
                    try {
                        return findChildByName(name);
                    } catch (AppException ex) {
                        return null; // hoặc có thể bỏ qua
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }

    @Override
    public ParentCategoryEntity getParentByChild(String name) throws AppException {
        if(name == null || name.isEmpty()) return null;

        return findChildByName(name).getParent();
    }

    @Override
    public boolean isSameParent(List<String> childIds) throws AppException {
        if(childIds == null || childIds.isEmpty())  throw new AppException(ErrorCode.INVALID_INPUT);
        List<ChildCategoryEntity> childCategories = findChildByIds(childIds);
        String parentId = childCategories.getFirst().getParent().getId();
        for(ChildCategoryEntity childCategoryEntity : childCategories) {
            if(!parentId.equals(childCategoryEntity.getParent().getId())) return false;
        }
        return true;
    }

    @Override
    public List<ChildCategoryEntity> findChildByIds(List<String> ids) throws AppException {
        List<ChildCategoryEntity> childCategoryEntities = new ArrayList<>();
        for(String id : ids){
            childCategoryEntities.add(findChildById(id));
        }
        return childCategoryEntities;
    }

    @Override
    public boolean existParentByName(String name){
        return parentRepo.existsByName(name);
    }

    @Override
    public boolean existChildByName(String name){
        return childRepo.existsByName(name);
    }

    @Override
    public ParentCategoryEntity saveParent(ParentCategoryEntity entity){
        return parentRepo.save(entity);
    }

    @Override
    public ChildCategoryEntity saveChild(ChildCategoryEntity entity){
        return childRepo.save(entity);
    }

    @Override
    public List<ParentCategoryEntity> saveAllParent(List<ParentCategoryEntity> entity){
        return parentRepo.saveAll(entity);
    }

    @Override
    public List<ChildCategoryEntity> saveAllChild(List<ChildCategoryEntity> entity){
        return childRepo.saveAll(entity);
    }

    @Override
    public List<ParentCategoryEntity> findAllParents(){
        return parentRepo.findAll();
    }



}
