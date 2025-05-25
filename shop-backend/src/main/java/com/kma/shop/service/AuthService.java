package com.kma.shop.service;

import com.kma.shop.dto.request.ChangePasswordRequest;
import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.request.UserLoginRequest;
import com.kma.shop.dto.response.AuthResponse;
import com.kma.shop.entity.EmailCreationTemporaryEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.UserMapping;
import com.kma.shop.utils.TokenUtils;
import com.nimbusds.jose.JOSEException;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class  AuthService {

    @Autowired
    private UserMapping userMapping;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private UserService userService;

    @Autowired
    private SignupVerificationService signupVerificationService;

    @Autowired
    private EmailCreationTemporaryService emailCreationTemporaryService;

    @Autowired
    private EmailService emailService;


    public AuthResponse changePassword(ChangePasswordRequest request) throws JOSEException, AppException {
        UserEntity userEntity = userService.getUserCurrent();
        if( !  userService.isRightPassword(request.getOldPassword()))
            throw new AppException(ErrorCode.CONFLICT);
        userService.changePassword(userEntity, request.getNewPassword());
        return AuthResponse.builder()
                .user(userMapping.toUserResponse(userEntity))
                .token(tokenUtils.generateToken(userEntity))
                .build();
    }


    public boolean logout(String token) throws ParseException {
        return tokenUtils.removeToken(token);
    }

    public boolean authenticateToken(String token) throws ParseException, JOSEException  {
        return tokenUtils.checkToken(token);
    }

    public String generateSignupVerificationCode(){
        return UUID.randomUUID().toString();
    }


    public boolean  signupByEmail(UserCreationRequest userCreationRequest)
            throws MessagingException, AppException {
        if(userCreationRequest.getEmail() != null && !userService.existByEmail(userCreationRequest.getEmail()))
        {
            String code = generateSignupVerificationCode();
            signupVerificationService.saveSignupAuthentication(code, userCreationRequest.getEmail());
            emailService.signupVerify(userCreationRequest.getEmail(), code);
            emailCreationTemporaryService.delete(userCreationRequest.getEmail());
            emailCreationTemporaryService.save(userCreationRequest);
            return true;
        }
        throw new AppException(ErrorCode.NOT_AUTHENTICATION);
    }

    public AuthResponse verifySignupByEmail(String email, String code, String customId)
            throws AppException, JOSEException {
        if(verifyEmailCode(email, code) && !userService.existByCustomId(customId)){
            EmailCreationTemporaryEntity entity = emailCreationTemporaryService.findByEmail(email);
            UserCreationRequest userCreationRequest = userMapping.toUserCreation(entity);
            userCreationRequest.setCustomId(customId);
            UserEntity userEntity = userService.createUserByEmail(userCreationRequest);
            return AuthResponse.builder()
                    .user(userMapping.toUserResponse(userEntity))
                    .token(tokenUtils.generateToken(userEntity))
                    .build();
        }
        throw new AppException(ErrorCode.NOT_AUTHENTICATION);
    }

    public boolean verifyEmailCode(String email, String code) throws AppException {
        if(signupVerificationService.verification(email, code)){
            signupVerificationService.delete(email);
            return true;
        }
        return false;
    }

    public AuthResponse signup(UserCreationRequest userCreationRequest)
            throws AppException, JOSEException {
        if(!userService.checkAttribute(userCreationRequest))
            throw  new AppException(ErrorCode.CONFLICT);
        if(userService.existByCustomId(userCreationRequest.getCustomId()))
            throw  new AppException(ErrorCode.CONFLICT);
        UserEntity userEntity = null;
        if(userCreationRequest.getPhone() != null && !userService.existByPhone(userCreationRequest.getPhone()))
            userEntity = userService.createUserByPhone(userCreationRequest);
        else if(userCreationRequest.getCustomId() != null
                && !userService.existByCustomId(userCreationRequest.getCustomId()))
            userEntity = userService.createUserByCustomId(userCreationRequest);
        if(userEntity == null) throw new AppException(ErrorCode.CONFLICT);
        return AuthResponse.builder()
                .user(userMapping.toUserResponse(userEntity))
                .token(tokenUtils.generateToken(userEntity))
                .build();
    }

    public AuthResponse login(UserLoginRequest request) throws AppException, JOSEException {
        UserEntity userEntity;
        if(request.getEmail() != null && !request.getEmail().isEmpty()
                && userService.existByEmail(request.getEmail()))
            userEntity = userService.loginByEmail(request);
        else if(request.getPhone() != null && !request.getPhone().isEmpty()
                && userService.existByPhone(request.getPhone()))
            userEntity = userService.loginByPhone(request);
        else
            userEntity = userService.loginByCustomId(request);
        return AuthResponse.builder()
                .user(userMapping.toUserResponse(userEntity))
                .token(tokenUtils.generateToken(userEntity))
                .build();
    }
}
