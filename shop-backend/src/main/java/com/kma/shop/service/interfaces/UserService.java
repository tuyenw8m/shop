package com.kma.shop.service.interfaces;

import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.request.UserEditRequest;
import com.kma.shop.dto.request.UserLoginRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.UserResponse;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;

public interface UserService {
    UserEntity getCurrentUser();

    PageResponse<UserResponse> getUsers(String search, int page, int limit) throws AppException;

    UserEntity save(UserEntity user);

    UserResponse getCurrentUserInfo() throws AppException;

    boolean deleteUser() throws AppException;

    UserResponse changeInfo(UserEditRequest request) throws AppException;

    UserEntity changePassword(UserEntity user, String newPassword);

    boolean isRightPassword(String password) throws AppException;

    UserEntity getUserCurrent() throws AppException;

    UserEntity findUserById(String id) throws AppException;

    UserEntity loginByEmail(UserLoginRequest request) throws AppException;

    UserEntity loginByPhone(UserLoginRequest request) throws AppException;

    boolean existByEmail(String email);

    boolean existByPhone(String phone);

    boolean existByName(String name);

    boolean checkAttribute(UserCreationRequest request);

    UserEntity createUser(UserCreationRequest userCreationRequest) throws AppException;
}
