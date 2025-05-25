package com.kma.shop.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserSummaryResponse {
    String userId;
    String customId;
    String userName;
    String imageLink;
    String conversationId;
}
