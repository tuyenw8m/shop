package com.kma.shop.service.impl;


import com.kma.shop.entity.Authority;
import com.kma.shop.repo.AuthorityRepo;
import com.kma.shop.service.interfaces.AuthorityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class  AuthorityServiceImpl implements AuthorityService {
    AuthorityRepo repo;

    @Override
    public Authority getAuthorityByName(String name){
        return repo.findByName(name);
    }

    @Override
    public boolean existsAuthorityName(String name){
        return repo.existsByName(name);
    }

    @Override
    public boolean deleteAuthorityByName(String name){
        return repo.deleteByName(name);
    }
}
