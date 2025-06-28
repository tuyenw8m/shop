package com.kma.shop.mapping;


import com.kma.shop.dto.request.UserCreationRequest;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.PublicUserProfileResponse;
import com.kma.shop.dto.response.UserResponse;
import com.kma.shop.dto.response.UserSummaryResponse;
import com.kma.shop.entity.Authority;
import com.kma.shop.entity.EmailCreationTemporaryEntity;
import com.kma.shop.entity.RoleEntity;
import com.kma.shop.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserMapping {

    public UserEntity buildUserBase(String email, String phone, String name, String password, String address, String imageLink, Set<RoleEntity> roles){

        return UserEntity.builder()
                .email(email)
                .phone(phone)
                .name(name)
                .password(password)
                .imageLink(imageLink)
                .address(address)
                .roles(roles)
                .build();
    }

    public UserCreationRequest toUserCreation(EmailCreationTemporaryEntity request){
        return UserCreationRequest.builder()
                .phone(request.getPhone())
                .address(request.getAddress())
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .build();
    }

    public EmailCreationTemporaryEntity toEmailTemporary(UserCreationRequest request){
        return EmailCreationTemporaryEntity.builder()
                .phone(request.getPhone())
                .address(request.getAddress())
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .build();
    }


    public PageResponse<UserSummaryResponse> toUserSummaryResponses(Page<UserEntity> userEntities) {
        List<UserSummaryResponse> userSummaryResponses = new ArrayList<>();
        for (UserEntity userEntity : userEntities.getContent()) {
            userSummaryResponses.add(toUserSummaryResponse(userEntity));
        }
        return PageResponse.<UserSummaryResponse>builder()
                .content(userSummaryResponses)
                .totalElements(userEntities.getTotalElements())
                .totalPages(userEntities.getTotalPages())
                .pageNumber(userEntities.getNumber())
                .pageSize(userEntities.getSize())
                .build();
    }



    public PageResponse<UserSummaryResponse> toAllWaitingResponse(Page<UserEntity> userEntities) {
        List<UserSummaryResponse> userSummaryResponses = new ArrayList<>();
        for (UserEntity userEntity : userEntities.getContent()) {
            userSummaryResponses.add(toAllWaitingResponse(userEntity));
        }
        return PageResponse.<UserSummaryResponse>builder()
                .content(userSummaryResponses)
                .totalElements(userEntities.getTotalElements())
                .totalPages(userEntities.getTotalPages())
                .pageNumber(userEntities.getNumber())
                .pageSize(userEntities.getSize())
                .build();
    }

    public PageResponse<UserSummaryResponse> toAllAcceptedResponse(Page<UserEntity> userEntities) {
        List<UserSummaryResponse> userSummaryResponses = new ArrayList<>();
        for (UserEntity userEntity : userEntities.getContent()) {
            userSummaryResponses.add(toAllAcceptedResponse(userEntity));
        }
        return PageResponse.<UserSummaryResponse>builder()
                .content(userSummaryResponses)
                .totalElements(userEntities.getTotalElements())
                .totalPages(userEntities.getTotalPages())
                .pageNumber(userEntities.getNumber())
                .pageSize(userEntities.getSize())
                .build();
    }

    public PageResponse<UserSummaryResponse> toAllPendingResponse(Page<UserEntity> userEntities) {
        List<UserSummaryResponse> userSummaryResponses = new ArrayList<>();
        for (UserEntity userEntity : userEntities.getContent()) {
            userSummaryResponses.add(toAllPendingResponse(userEntity));
        }
        return PageResponse.<UserSummaryResponse>builder()
                .content(userSummaryResponses)
                .totalElements(userEntities.getTotalElements())
                .totalPages(userEntities.getTotalPages())
                .pageNumber(userEntities.getNumber())
                .pageSize(userEntities.getSize())
                .build();
    }



    public Set<UserSummaryResponse> toUserSummaryResponses(Set<UserEntity> userEntities) {
        Set<UserSummaryResponse> userSummaryResponses = new HashSet<>();
        for (UserEntity userEntity : userEntities) {
            userSummaryResponses.add(toUserSummaryResponse(userEntity));
        }
        return userSummaryResponses;
    }

    public UserSummaryResponse toAllAcceptedResponse(UserEntity userEntity) {
        return UserSummaryResponse.builder()
                .userId(userEntity.getId())
                .userName(userEntity.getName())
                .imageLink(userEntity.getImageLink())
                .build();
    }

    public UserSummaryResponse toAllPendingResponse(UserEntity userEntity) {
        return UserSummaryResponse.builder()
                .userId(userEntity.getId())
                .userName(userEntity.getName())
                .imageLink(userEntity.getImageLink())
                .build();
    }

    public UserSummaryResponse toAllWaitingResponse(UserEntity userEntity) {
        return UserSummaryResponse.builder()
                .userId(userEntity.getId())
                .userName(userEntity.getName())
                .imageLink(userEntity.getImageLink())
                .build();
    }

    public UserSummaryResponse toUserSummaryResponse(UserEntity userEntity) {
        return UserSummaryResponse.builder()
                .userId(userEntity.getId())
                .userName(userEntity.getName())
                .imageLink(userEntity.getImageLink())
                .build();
    }

    public PublicUserProfileResponse toPublicProfile(UserEntity user){
        if (user == null) {
            return null;
        }
        PublicUserProfileResponse response = new PublicUserProfileResponse();
        response.setUserName(user.getName());
        response.setImageLink(user.getImageLink() != null ? user.getImageLink() : "");
        response.setUserId(user.getId());
        return response;
    }

    public UserResponse toUserResponse(UserEntity user) {
        if (user == null) {
            return null;
        }
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail() != null ? user.getEmail() : ""); // Xử lý null thành chuỗi rỗng
        response.setPhone(user.getPhone() != null ? user.getPhone() : "");
        response.setAvatar_url(user.getImageLink() != null ? user.getImageLink() : "");
        response.setRoles(user.getRoles().stream().map(RoleEntity::getRoleName).collect(Collectors.toList()));

        response.setAddress(user.getAddress() != null ? user.getAddress() : "");
        return response;
    }

}
