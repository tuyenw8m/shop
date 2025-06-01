package com.kma.shop.service;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.request.UserEditRequest;
import com.kma.shop.dto.request.UserLoginRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.PublicUserProfileResponse;
import com.kma.shop.dto.response.UserResponse;
import com.kma.shop.dto.response.UserSummaryResponse;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.mapping.UserMapping;
import com.kma.shop.repo.UserRepo;
import com.kma.shop.utils.Amazon3SUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private RoleService roleService;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapping userMapping;

    @Autowired
    private Amazon3SUtils amazon3SUtils;

    public UserResponse toUserResponse(UserEntity userEntity) {
        return UserResponse.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .phone(userEntity.getPhone())
                .avatar_url(userEntity.getImageLink())
                .address(userEntity.getAddress())
                .build();
    }

    public PageResponse<UserResponse> getUsers(String search, int page, int limit) throws AppException {
        Pageable pageable = PageRequest.of(page, limit);
        Page<UserEntity> users = userRepo.findByNameContaining(search, pageable).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return PageResponse.<UserResponse>builder()
                .content(users.getContent().stream().map(this::toUserResponse).toList())
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .pageSize(users.getSize())
                .pageNumber(users.getNumber())
                .build();
    }


    public UserEntity save(UserEntity user) {
        return userRepo.save(user);
    }

    public UserResponse getCurrentUserInfo() throws AppException {
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        UserResponse response;
        UserEntity user = getUserCurrent();
        response = userMapping.toUserResponse(user);;
        return  response;
    }


    public boolean deleteUser() throws AppException {
        UserEntity user = getUserCurrent();
        user.setEmail("null");
        user.setPhone("null");
        userRepo.save(user);
        return true;
    }

    public UserResponse changeInfo(UserEditRequest request) throws AppException {
        UserEntity user = getUserCurrent();
        if(request.getName() != null)
            user.setName(request.getName());
        if(request.getEmail() != null)
            user.setEmail(request.getEmail());
        if(request.getPhone() != null)
            user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        userRepo.save(user);
        return userMapping.toUserResponse(user);
    }

    public UserEntity changePassword(UserEntity user, String newPassword){
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepo.save(user);
    }

    public boolean isRightPassword(String password) throws AppException {
        UserEntity user = getUserCurrent();
        return passwordEncoder.matches(password, user.getPassword());
    }

    public UserEntity getUserCurrent() throws AppException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findById(userId).orElseThrow(()-> new AppException(ErrorCode.CONFLICT));
    }

    public UserEntity findUserById(String id) throws AppException {
        return userRepo.findById(id).orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
    }


    public UserEntity loginByEmail(UserLoginRequest request) throws AppException {
        UserEntity user =  userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_AUTHENTICATION));
        if(passwordEncoder.matches(request.getPassword(), user.getPassword())) return user;
        throw new AppException(ErrorCode.NOT_AUTHENTICATION);
    }

    public UserEntity loginByPhone(UserLoginRequest request) throws AppException {
        UserEntity user =  userRepo.findByPhone(request.getPhone())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_AUTHENTICATION));
        if(passwordEncoder.matches(request.getPassword(), user.getPassword())) return user;
        throw new AppException(ErrorCode.NOT_AUTHENTICATION);
    }



    public boolean existByEmail(String email){
        return userRepo.existsByEmail(email);
    }

    public boolean existByPhone(String phone){
        return userRepo.existsByPhone(phone);
    }

    public boolean existByName(String name){
        return userRepo.existsByName(name);
    }


    public boolean checkAttribute(UserCreationRequest request)  {
        return  !(request.getPassword() == null | request.getName() == null | request.getEmail() == null);
    }

    public UserEntity createUser(UserCreationRequest userCreationRequest) throws AppException {
        UserEntity user = UserEntity.builder()
                .phone(userCreationRequest.getPhone())
                .name(userCreationRequest.getName())
                .email(userCreationRequest.getEmail())
                .roles(Set.of(roleService.getRoleByRoleName("USER")))
                .password(passwordEncoder.encode(userCreationRequest.getPassword()))
                .build();
        return userRepo.save(user);
    }
}
