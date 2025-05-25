package com.kma.shop.service;


import com.kma.shop.entity.RoleEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {
    @Autowired
    private RoleRepo roleRepo;

    public RoleEntity getRoleByRoleName(String name) throws AppException {
        return roleRepo.findByRoleName(name).orElseThrow(() -> new AppException((ErrorCode.CONFLICT)));
    }

}
