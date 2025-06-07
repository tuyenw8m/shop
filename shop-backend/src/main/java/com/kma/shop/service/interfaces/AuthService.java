package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.ChangePasswordRequest;
import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.request.UserLoginRequest;
import com.kma.shop.dto.response.AuthResponse;
import com.kma.shop.exception.AppException;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;

import java.text.ParseException;

public interface AuthService {
    AuthResponse changePassword(ChangePasswordRequest request) throws JOSEException, AppException, ParseException;

    boolean logout(String token) throws ParseException;

    boolean authenticateToken(String token) throws ParseException, JOSEException;

    String generateSignupVerificationCode();

    boolean  signupByEmail(UserCreationRequest userCreationRequest)
            throws MessagingException, AppException;

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
    boolean verifyEmailCode(String email, String code) throws AppException;

    AuthResponse signup(UserCreationRequest userCreationRequest)
            throws AppException, JOSEException, ParseException;

    AuthResponse login(UserLoginRequest request) throws AppException, JOSEException, ParseException;
}
