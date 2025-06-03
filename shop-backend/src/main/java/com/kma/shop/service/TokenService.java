package com.kma.shop.service;

import com.kma.shop.entity.TokenEntity;
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

    public boolean exist(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        String id =  signedJWT.getJWTClaimsSet().getJWTID();
        return tokenRepo.existsByToken(id);
    }

    public TokenEntity save(TokenEntity token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token.getToken());
        String id =  signedJWT.getJWTClaimsSet().getJWTID();
        token.setToken(id);
        return tokenRepo.save(token);
    }

    public void delete(TokenEntity token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token.getToken());
        String id =  signedJWT.getJWTClaimsSet().getJWTID();
        token.setToken(id);
        tokenRepo.delete(token);
    }

    public void deleteByToken(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        String id =  signedJWT.getJWTClaimsSet().getJWTID();
        tokenRepo.deleteByToken(id);
    }

    public TokenEntity findByToken(String token) throws AppException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        String id =  signedJWT.getJWTClaimsSet().getJWTID();
        return tokenRepo.findByToken(id).orElseThrow(()->new AppException(ErrorCode.CONFLICT));
    }
}
