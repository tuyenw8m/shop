package com.kma.shop.service;


import com.kma.shop.entity.SignupVerificationEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.SignupVerificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class  SignupVerificationService {
    @Autowired
    private SignupVerificationRepo repo;

    public void saveSignupAuthentication(String id, String email){
        repo.deleteByEmail(email);
        repo.save(SignupVerificationEntity.builder()
                        .id(id)
                        .email(email)
                        .expirationTime(LocalDateTime.now().plusMinutes(5))
                .build());
    }

    public boolean verification(String email, String code) throws AppException {
        SignupVerificationEntity entity = repo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return code.equals(entity.getId()) && entity.getExpirationTime().isAfter(LocalDateTime.now());
    }

    public void delete(String email){
        repo.deleteByEmail(email);
    }

    public SignupVerificationEntity getByCode(String code) throws AppException {
        return repo.findById(code).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
    }
}
