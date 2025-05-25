package com.kma.shop.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode{
    REFRESH_TOKEN_INVALID(400, "Refresh token invalid", HttpStatus.BAD_REQUEST),
    USER_EXISTED(400, "User Existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(400, "User not existed", HttpStatus.BAD_REQUEST),
    WRONG_PASSWORD_OR_USERID(400, "Wrong password or userid", HttpStatus.BAD_REQUEST),
    NOT_AUTHENTICATION(401, "Not authentication", HttpStatus.UNAUTHORIZED),
    NOT_AUTHORIZATION(403, "Not authorization", HttpStatus.FORBIDDEN),
    CONFLICT(409, "Lack of informatio", HttpStatus.CONFLICT);
    @Getter
    int status;
    String message;
    HttpStatus httpStatus;

    ErrorCode(int status, String message,HttpStatus httpStatus){
        this.status = status;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
