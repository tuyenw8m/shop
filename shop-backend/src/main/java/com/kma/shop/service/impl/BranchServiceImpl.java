package com.kma.shop.service.impl;

import com.kma.shop.dto.request.BranchCreationRequest;
import com.kma.shop.dto.response.BranchResponse;
import com.kma.shop.entity.BranchEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.BranchMapping;
import com.kma.shop.repo.BranchRepo;
import com.kma.shop.service.interfaces.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {
    BranchRepo branchRepo;
    BranchMapping branchMapping;

    @Override
    public boolean existsAllByName(List<String> names){
        for(String name : names){
            if(!branchRepo.existsByName(name)) return false;
        }
        return true;
    }

    @Override
    public int count(){
        return Math.toIntExact(branchRepo.count());
    }

    @Override
    public BranchEntity save(BranchEntity entity){
        return branchRepo.save(entity);
    }

    @Override
    public List<BranchEntity> saveAll(List<BranchEntity> entities){
        return branchRepo.saveAll(entities);
    }

    @Override
    public void deleteById(String id){
        branchRepo.deleteById(id);
    }

    @Override
    public void deleteAllById(List<String> ids){
        branchRepo.deleteAllById(ids);
    }

    @Override
    @Transactional
    public void deleteByName(String name) throws AppException {
        BranchEntity branch = branchRepo.findByName(name).orElseThrow(
                () ->  new AppException(ErrorCode.BRANCH_NOT_FOUND)
        );
        if (branch == null) {
            throw new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }

        if (branch.getCategories() != null && !branch.getCategories().isEmpty()) {
            throw new AppException(ErrorCode.BRANCH_CANNOT_DELETE);
        }

        if (branch.getProduct() != null && !branch.getProduct().isEmpty()) {
            throw new AppException(ErrorCode.BRANCH_CANNOT_DELETE);
        }

        branchRepo.delete(branch);
    }


    @Override
    public void deleteAllByName(List<String> names){
        names.forEach(branchRepo::deleteByName);
    }

    @Override
    public BranchResponse create(BranchCreationRequest request) throws AppException {
        if(request == null) return null;
        if(branchRepo.existsByName(request.getName()))
            throw new AppException(ErrorCode.BRANCH_EXISTED);
        return branchMapping.toBranchResponse(save(branchMapping.toBranchEntity(request)));
    }

    @Override
    public BranchEntity findById(String id){
        if(id == null) return null;
        return branchRepo.findById(id).orElse(null);
    }

    @Override
    public BranchEntity findByName(String name) throws AppException {
        if(name == null) return null;
        return branchRepo.findByName(name).orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_FOUND));
    }

    @Override
    public BranchResponse getById(String id){
        if(id == null) return null;
        return branchMapping.toBranchResponse(findById(id));
    }

    @Override
    public BranchResponse getByName(String name) throws AppException {
        if(name == null) return null;
        return branchMapping.toBranchResponse(findByName(name));
    }

    @Override
    public BranchResponse update(BranchCreationRequest request, String name) throws AppException {
        if(request == null) return null;
        if(name == null) return null;

        BranchEntity branchEntity = findByName(name);
        if(branchEntity == null) {
            throw  new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }

        branchEntity.setName(request.getName());
        branchEntity.setDescription(request.getDescription());

        return branchMapping.toBranchResponse(branchRepo.save(branchEntity));
    }

    @Override
    public List<BranchResponse> getByNames(List<String> names) throws AppException {
        if(names == null || names.isEmpty()) return branchMapping.toBranchResponses(branchRepo.findAll());
        List<BranchEntity> entities = new ArrayList<>();
        for(String name : names){
            entities.add(findByName(name));
        }
        return branchMapping.toBranchResponses(entities);
    }

    @Override
    public List<BranchEntity> findAll(){
        return branchRepo.findAll();
    }

    @SneakyThrows
    @Override
    public List<BranchEntity> findByNames(List<String> names){
        if(names == null || names.isEmpty()) return List.of();
        List<BranchEntity> entities = new ArrayList<>();
        for(String name : names){
            entities.add(findByName(name));
        }
        return entities;
    }
}
