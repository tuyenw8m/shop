package com.kma.shop.service.impl;


import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.entity.EmailCreationTemporaryEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.EmailCreationTemporaryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailCreationTemporaryService {

    @Autowired
    private EmailCreationTemporaryRepo repo;

    public void save(UserCreationRequest request){
        repo.save(EmailCreationTemporaryEntity.builder()
                        .email(request.getEmail())
                        .name(request.getName())
                        .password(request.getPassword())
                .build());
    }

    public EmailCreationTemporaryEntity findByEmail(String email) throws AppException {
        return repo.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.NOT_AUTHENTICATION));
    }

    public void delete(String email){
        repo.deleteByEmail(email);
    }
}
