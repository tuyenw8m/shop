package com.kma.shop.controller;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.UserEditRequest;
import com.kma.shop.dto.response.PublicUserProfileResponse;
import com.kma.shop.dto.response.UserResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/user/my_profile")
    public ApiResponse<UserResponse> getMyProfile() throws AppException, JsonProcessingException {
        return ApiResponse.<UserResponse>builder()
                .data(userService.getCurrentUserInfo())
                .build();
    }

    @GetMapping("/user/profile")
    public ApiResponse<PublicUserProfileResponse> getProfile(@RequestParam String customId) throws AppException, JsonProcessingException {
        return ApiResponse.<PublicUserProfileResponse>builder()
                .data(userService.getUserInfo(customId))
                .build();
    }

    @Transactional
    @PutMapping("/user/edit")
    public ApiResponse<UserResponse> editUserInfo(@ModelAttribute UserEditRequest request) throws AppException, ParseException {
        return ApiResponse.<UserResponse>builder()
                .data(userService.changeInfo(request))
                .build();
    }

    @Transactional
    @PutMapping("/user/delete")
    public ApiResponse<Boolean> deleteUser() throws AppException {
        return ApiResponse.<Boolean>builder()
                .data(userService.deleteUser())
                .build();
    }
}
