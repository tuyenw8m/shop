package com.kma.shop.service.impl;

import com.kma.shop.dto.request.ChangePasswordRequest;
import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.request.UserLoginRequest;
import com.kma.shop.dto.response.AuthResponse;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.UserMapping;
import com.kma.shop.service.interfaces.AuthService;
import com.kma.shop.service.interfaces.UserService;
import com.kma.shop.utils.TokenUtils;
import com.nimbusds.jose.JOSEException;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class  AuthServiceImpl  implements AuthService {

    UserMapping userMapping;
    TokenUtils tokenUtils;
    UserService userService;
    SignupVerificationService signupVerificationService;
    EmailCreationTemporaryService emailCreationTemporaryService;
    EmailService emailService;
    TokenService tokenService;


    @Override
    public AuthResponse changePassword(ChangePasswordRequest request) throws JOSEException, AppException, ParseException {
        UserEntity userEntity = userService.getUserCurrent();
        if( !  userService.isRightPassword(request.getOldPassword()))
            throw new AppException(ErrorCode.CONFLICT);
        userService.changePassword(userEntity, request.getNewPassword());
        return AuthResponse.builder()
                .user(userMapping.toUserResponse(userEntity))
                .token(tokenUtils.generateToken(userEntity))
                .build();
    }
    @Override
    public boolean logout(String token) throws ParseException {
        return tokenUtils.removeToken(token);
    }
    @Override
    public boolean authenticateToken(String token) throws ParseException, JOSEException  {
        return tokenUtils.checkToken(token);
    }
    @Override
    public String generateSignupVerificationCode(){
        return UUID.randomUUID().toString();
    }

    @Override
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

//    public AuthResponse verifySignupByEmail(String email, String code, String customId)
//            throws AppException, JOSEException {
//        if(verifyEmailCode(email, code) && !userService.existByCustomId(customId)){
//            EmailCreationTemporaryEntity entity = emailCreationTemporaryService.findByEmail(email);
//            UserCreationRequest userCreationRequest = userMapping.toUserCreation(entity);
//            UserEntity userEntity = userService.createUserByEmail(userCreationRequest);
//            return AuthResponse.builder()
//                    .user(userMapping.toUserResponse(userEntity))
//                    .token(tokenUtils.generateToken(userEntity))
//                    .build();
//        }
//        throw new AppException(ErrorCode.NOT_AUTHENTICATION);
//    }
    @Override
    public boolean verifyEmailCode(String email, String code) throws AppException {
        if(signupVerificationService.verification(email, code)){
            signupVerificationService.delete(email);
            return true;
        }
        return false;
    }

    @Override
    public AuthResponse signup(UserCreationRequest userCreationRequest)
            throws AppException, JOSEException {
        if(!userService.checkAttribute(userCreationRequest))
            throw  new AppException(ErrorCode.CONFLICT);
        if(userService.existByEmail(userCreationRequest.getEmail())
                || userService.existByName(userCreationRequest.getEmail()))
            throw new AppException(ErrorCode.USER_EXISTED);
        UserEntity userEntity = userService.createUser(userCreationRequest);
        if(userEntity == null) throw new AppException(ErrorCode.CONFLICT);
        return AuthResponse.builder()
                .user(userMapping.toUserResponse(userEntity))
                .token(tokenUtils.generateToken(userEntity))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(UserLoginRequest request) throws AppException, JOSEException, ParseException {
        if(request.getEmail() == null || request.getPassword() == null
                || request.getEmail().isEmpty() || request.getPassword().isEmpty())
            throw new AppException(ErrorCode.NOT_AUTHENTICATION);
        UserEntity userEntity = userService.loginByEmail(request);
        return AuthResponse.builder()
                .user(userMapping.toUserResponse(userEntity))
                .token(tokenUtils.generateToken(userEntity))
                .build();
    }
}
