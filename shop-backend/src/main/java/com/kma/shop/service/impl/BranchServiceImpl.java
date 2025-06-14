package com.kma.shop.service.impl;

import com.kma.shop.dto.request.BranchCreationRequest;
import com.kma.shop.dto.response.BranchResponse;
import com.kma.shop.entity.BranchEntity;
import com.kma.shop.mapping.BranchMapping;
import com.kma.shop.repo.BranchRepo;
import com.kma.shop.service.interfaces.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {
    BranchRepo branchRepo;
    BranchMapping branchMapping;

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
    public void deleteByName(String name){
        branchRepo.deleteByName(name);
    }

    @Override
    public void deleteAllByName(List<String> names){
        names.forEach(branchRepo::deleteByName);
    }

    @Override
    public BranchResponse create(BranchCreationRequest request){
        if(request == null) return null;
        return branchMapping.toBranchResponse(save(branchMapping.toBranchEntity(request)));
    }

    @Override
    public BranchEntity findById(String id){
        if(id == null) return null;
        return branchRepo.findById(id).orElse(null);
    }

    @Override
    public BranchEntity findByName(String name){
        if(name == null) return null;
        return branchRepo.findByName(name);
    }

    @Override
    public BranchResponse getById(String id){
        if(id == null) return null;
        return branchMapping.toBranchResponse(findById(id));
    }

    @Override
    public BranchResponse getByName(String name){
        if(name == null) return null;
        return branchMapping.toBranchResponse(findByName(name));
    }

    @Override
    public BranchResponse update(BranchCreationRequest request, String name){
        if(request == null) return null;
        if(name == null) return null;

        BranchEntity branchEntity = findById(name);
        branchEntity.setName(name);
        branchEntity.setDescription(request.getDescription());
        return branchMapping.toBranchResponse(branchRepo.save(branchEntity));
    }

    @Override
    public List<BranchEntity> findAll(){
        return branchRepo.findAll();
    }

    @Override
    public List<BranchEntity> findByNames(List<String> names){
        return names.stream().map(branchRepo::findByName).collect(Collectors.toList());
    }
}
