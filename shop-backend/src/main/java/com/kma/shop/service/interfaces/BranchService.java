package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.BranchCreationRequest;
import com.kma.shop.dto.response.BranchResponse;
import com.kma.shop.entity.BranchEntity;

import java.util.List;

public interface BranchService {
    int count();

    BranchEntity save(BranchEntity entity);

    List<BranchEntity> saveAll(List<BranchEntity> entities);

    void deleteById(String id);

    void deleteAllById(List<String> ids);

    void deleteByName(String name);

    void deleteAllByName(List<String> names);

    BranchResponse create(BranchCreationRequest request);

    BranchEntity findById(String id);

    BranchEntity findByName(String name);

    BranchResponse getById(String id);

    BranchResponse getByName(String name);

    BranchResponse update(BranchCreationRequest request, String name);

    List<BranchEntity> findAll();

    List<BranchEntity> findByNames(List<String> names);
}
