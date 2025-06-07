package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.ChangePasswordRequest;
import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.request.UserLoginRequest;
import com.kma.shop.dto.response.AuthResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.AuthService;
import com.nimbusds.jose.JOSEException;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;

    @GetMapping("/test")
    public String test() {
        return "Hell0";
    }

    @Transactional
    @PutMapping("/changepassword")
    public ApiResponse<AuthResponse> changePassword(@RequestBody ChangePasswordRequest request)
            throws JOSEException, AppException, ParseException {
                return ApiResponse.<AuthResponse>builder()
                .data(authService.changePassword(request))
                .build();
    }

    @PostMapping("/auth/register")
    @Transactional
    public ApiResponse<AuthResponse> signup(@RequestBody UserCreationRequest request)
            throws AppException, JOSEException, ParseException {
        return ApiResponse.<AuthResponse>builder()
                .data(authService.signup(request))
                .build();
    }

    @PostMapping("/signup/email")
    @Transactional
    public ApiResponse<Boolean> signupByEmail(@RequestBody UserCreationRequest request)
            throws MessagingException, AppException {
        return ApiResponse.<Boolean>builder()
                .data(authService.signupByEmail(request))
                .build();
    }

//    @PostMapping("/verify/email")
//    public ApiResponse<AuthResponse> signup(@RequestBody VerificationEmailRequest request)
//            throws AppException, JOSEException {
//        return ApiResponse.<AuthResponse>builder()
//                .data(authService.verifySignupByEmail(request.getEmail(), request.getCode(), request.getCustomId()))
//                .build();
//    }


    @PostMapping("/auth/login")
    public ApiResponse<AuthResponse> login(@RequestBody UserLoginRequest request)
            throws AppException, JOSEException, ParseException {
        return ApiResponse.<AuthResponse>builder()
                .data(authService.login(request))
                .build();
    }

    @GetMapping("/authentication")
    public ApiResponse<Boolean> authentication(@RequestParam String token)
            throws  ParseException, JOSEException {
        return ApiResponse.<Boolean>builder()
                .data(authService.authenticateToken(token))
                .build();
    }

    @Transactional
    @PutMapping("/logoutt")
    public ApiResponse<Boolean> logout(@RequestBody String token)
            throws ParseException, AppException {
        return ApiResponse.<Boolean>builder()
                .data(authService.logout(token))
                .build();
    }

}
