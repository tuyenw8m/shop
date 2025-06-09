package com.kma.shop.service.impl;

import com.kma.shop.entity.TokenEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.TokenRepo;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public class TokenService {
    @Autowired
    private TokenRepo tokenRepo;

    public TokenEntity findByUser(UserEntity user) {
        return tokenRepo.findByUser(user).orElse(null);
    }

    public boolean existsByUser(UserEntity user) {
        return tokenRepo.existsByUser(user);
    }

    public boolean exist(String token) {
        return tokenRepo.existsByToken(token);
    }

    public void deleteByUser(UserEntity user)   {
        if(user == null)  return;
        user.setToken(null);
        tokenRepo.deleteByUser(user);
    }

    public TokenEntity save(TokenEntity token) throws ParseException {
        return tokenRepo.save(token);
    }

    public void delete(TokenEntity token) throws ParseException {
        tokenRepo.delete(token);
    }

    public void deleteByToken(String token) throws ParseException {
        tokenRepo.deleteByToken(token);
    }

    public TokenEntity findByToken(String token) throws AppException {
        return tokenRepo.findByToken(token).orElseThrow(()->new AppException(ErrorCode.CONFLICT));
    }
}
