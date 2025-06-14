package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.CategoryCreationRequest;
import com.kma.shop.dto.response.CategoryResponse;
import com.kma.shop.entity.ChildCategoryEntity;
import com.kma.shop.entity.ParentCategoryEntity;
import com.kma.shop.exception.AppException;

import java.util.List;

public interface CategoryServiceV2 {
    List<CategoryResponse> getAll();

    CategoryResponse createParent(CategoryCreationRequest request);

    CategoryResponse createChild(CategoryCreationRequest request, String parentId) throws AppException;

    CategoryResponse updateChild(CategoryCreationRequest request, String id) throws AppException;

    CategoryResponse updateParent(CategoryCreationRequest request, String id) throws AppException;

    void deleteChildById(String id);

    void deleteParentById(String id);

    ChildCategoryEntity findChildById(String id) throws AppException;

    CategoryResponse getChildById(String id) throws AppException;

    CategoryResponse getParentById(String id) throws AppException;

    ParentCategoryEntity findParentById(String id) throws AppException;

    ParentCategoryEntity findParentByName(String name) throws AppException;

    ChildCategoryEntity findChildByName(String name) throws AppException;

    List<ParentCategoryEntity> findParentByNames(List<String> names) throws AppException;

    List<ChildCategoryEntity> findChildByNames(List<String> names) throws AppException;

    ParentCategoryEntity getParentByChild(String name) throws AppException;

    boolean isSameParent(List<String> childNames) throws AppException;

    boolean existParentByName(String name);

    boolean existChildByName(String name);

    ParentCategoryEntity saveParent(ParentCategoryEntity entity);

    ChildCategoryEntity saveChild(ChildCategoryEntity entity);

    List<ParentCategoryEntity> saveAllParent(List<ParentCategoryEntity> entity);

    List<ChildCategoryEntity> saveAllChild(List<ChildCategoryEntity> entity);

    List<ParentCategoryEntity> findAllParents();
}
