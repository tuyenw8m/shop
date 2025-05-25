package com.kma.shop.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String customId;
    String userName;
    String password;
    String email;
    String phone;
    String bio;
    Date dob;
    String address;
}
