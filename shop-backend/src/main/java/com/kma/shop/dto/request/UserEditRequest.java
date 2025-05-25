package com.kma.shop.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class UserEditRequest {
    MultipartFile imageFile;
    String customId;
    String userName;
    String bio;
    String dob;
    String address;
    String email;
    String phone;
}
