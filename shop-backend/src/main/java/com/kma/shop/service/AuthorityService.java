package com.kma.shop.service;


import com.kma.shop.entity.Authority;
import com.kma.shop.repo.AuthorityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class  AuthorityService {
    @Autowired
    private AuthorityRepo repo;

    public Authority getAuthorityByName(String name){
        return repo.findByName(name);
    }

    public boolean existsAuthorityName(String name){
        return repo.existsByName(name);
    }

    public boolean deleteAuthorityByName(String name){
        return repo.deleteByName(name);
    }
}
