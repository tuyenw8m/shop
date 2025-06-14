package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.BranchCreationRequest;
import com.kma.shop.dto.response.BranchResponse;
import com.kma.shop.entity.BranchEntity;
import com.kma.shop.exception.AppException;

import java.util.List;

public interface BranchService {
    boolean existsAllByName(List<String> names);

    int count();

    BranchEntity save(BranchEntity entity);

    List<BranchEntity> saveAll(List<BranchEntity> entities);

    void deleteById(String id);

    void deleteAllById(List<String> ids);

    void deleteByName(String name) throws AppException;

    void deleteAllByName(List<String> names);

    BranchResponse create(BranchCreationRequest request) throws AppException;

    BranchEntity findById(String id);

    BranchEntity findByName(String name) throws AppException;

    BranchResponse getById(String id);

    BranchResponse getByName(String name) throws AppException;

    BranchResponse update(BranchCreationRequest request, String name) throws AppException;

    List<BranchResponse> getByNames(List<String> names) throws AppException;

    List<BranchEntity> findAll();

    List<BranchEntity> findByNames(List<String> names);
}
