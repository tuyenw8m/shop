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



    public PageResponse<UserSummaryResponse> searchByCustomId(String customId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        String userId  = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<Object[]> res = userRepo.
                findFriendByCustomIdContaining(".*" + customId +".*", userId, pageable);
        List<UserSummaryResponse> ok = res.stream().map(obj -> new UserSummaryResponse(
                (String)obj[0],
                (String)obj[1],
                (String)obj[2],
                (String)obj[3],
                (String)null
                )).toList();
        return  PageResponse.<UserSummaryResponse>builder()
                .totalPages(res.getTotalPages())
                .totalElements(res.getTotalElements())
                .pageSize(res.getSize())
                .pageNumber(res.getNumber())
                .content(ok)
                .build();
    }

    public UserResponse getCurrentUserInfo() throws AppException, JsonProcessingException {
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        UserResponse response;
        UserEntity user = getUserCurrent();
        response = userMapping.toUserResponse(user);;
        return  response;
    }


    public PublicUserProfileResponse getUserInfo(String customId) throws AppException, JsonProcessingException {
        PublicUserProfileResponse response ;
        UserEntity user = findUserByCustomId(customId);
        response =  userMapping.toPublicProfile(user);
        return response;
    }

    public boolean deleteUser() throws AppException {
        UserEntity user = getUserCurrent();
        user.setCustomId("null");
        user.setEmail("null");
        user.setPhone("null");
        userRepo.save(user);
        return true;
    }

    public UserResponse changeInfo(UserEditRequest request) throws AppException, ParseException {
        UserEntity user = getUserCurrent();
        if(request.getCustomId() != null)
            user.setCustomId(request.getCustomId());
        if(request.getUserName() != null)
            user.setUserName(request.getUserName());
        if(request.getBio() != null)
            user.setBio(request.getBio());
        if(request.getEmail() != null)
            user.setEmail(request.getEmail());
        if(request.getPhone() != null)
            user.setPhone(request.getPhone());
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date dob = request.getDob() != null ? dateFormat.parse(request.getDob()) : null;
        user.setDob(dob);
        user.setAddress(request.getAddress());
        String link = amazon3SUtils.addImageS3(request.getImageFile());
        if(link != null) user.setImageLink(link);
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

    public UserEntity findUserByCustomId(String customId) throws AppException, JsonProcessingException {
        UserEntity user ;
        user =  userRepo.findByCustomId(customId)
                .orElseThrow(() -> new AppException(ErrorCode.CONFLICT));
        return user;
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

    public UserEntity loginByCustomId(UserLoginRequest request) throws AppException {
        UserEntity user = userRepo.findByCustomId(request.getCustomId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_AUTHENTICATION));
        if(passwordEncoder.matches(request.getPassword(), user.getPassword()))
            return user;
        throw new AppException(ErrorCode.NOT_AUTHENTICATION);
    }

    public boolean existByEmail(String email){
        return userRepo.existsByEmail(email);
    }

    public boolean existByPhone(String phone){
        return userRepo.existsByPhone(phone);
    }

    public boolean existByCustomId(String userId){
        return userRepo.existsByCustomId(userId);
    }

    public UserEntity createUserByCustomId(UserCreationRequest userCreationRequest) throws AppException {
        UserEntity user = UserEntity.builder()
                .customId(userCreationRequest.getCustomId())
                .userName(userCreationRequest.getUserName())
                .roles(Set.of(roleService.getRoleByRoleName("USER")))
                .password(passwordEncoder.encode(userCreationRequest.getPassword()))
                .build();
        return userRepo.save(user);
    }

    public UserEntity createUserByEmail(UserCreationRequest userCreationRequest) throws AppException {
        UserEntity user = UserEntity.builder()
                .email(userCreationRequest.getEmail())
                .roles(Set.of(roleService.getRoleByRoleName("USER")))
                .customId(userCreationRequest.getCustomId())
                .userName(userCreationRequest.getUserName())
                .password(passwordEncoder.encode(userCreationRequest.getPassword()))
                .build();
        return userRepo.save(user);
    }

    public boolean checkAttribute(UserCreationRequest request)  {
        return request.getCustomId() != null && !(request.getPassword() == null | request.getUserName() == null);
    }

    public UserEntity createUserByPhone(UserCreationRequest userCreationRequest) throws AppException {
        UserEntity user = UserEntity.builder()
                .phone(userCreationRequest.getPhone())
                .customId(userCreationRequest.getCustomId())
                .userName(userCreationRequest.getUserName())
                .roles(Set.of(roleService.getRoleByRoleName("USER")))
                .password(passwordEncoder.encode(userCreationRequest.getPassword()))
                .build();
        return userRepo.save(user);
    }
}
