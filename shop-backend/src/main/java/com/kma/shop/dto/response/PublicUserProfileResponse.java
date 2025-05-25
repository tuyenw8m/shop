package com.kma.shop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublicUserProfileResponse {
    String userId;
    String userName;
    String imageLink;
    String customId;
    String bio;
}
