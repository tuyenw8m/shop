package com.kma.shop.utils;

import com.kma.shop.entity.Authority;
import com.kma.shop.entity.RoleEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.service.impl.TokenService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class TokenUtils {
    @Value("${jwt.signerKey}")
    @NonFinal
    String SIGNER_KEY;

    TokenService tokenService;


    //get token fron request
    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    //get user id by token
    public String getUserIdByToken(String token) throws ParseException {
        SignedJWT signedJWT;
        try {
            signedJWT = SignedJWT.parse(token);
        } catch (ParseException e) {
            return null;
        }
        return signedJWT.getJWTClaimsSet().getSubject();
    }

    //remove token
    public boolean removeToken(String token) throws ParseException {
        try {
            SignedJWT.parse(token);
        } catch (ParseException e) {
            return false;
        }
        tokenService.deleteByToken(token);
        return true;
    }

    // verify token
    public void isValidToken(String token) throws AppException, ParseException, JOSEException {
        SignedJWT signedJWT;
        try {
            signedJWT = SignedJWT.parse(token);
        } catch (ParseException e) {
            throw new AppException(ErrorCode.NOT_AUTHENTICATION);
        }
        System.err.println(signedJWT);
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        boolean verified = signedJWT.verify(verifier);
        if (!verified) {
            throw new AppException(ErrorCode.NOT_AUTHENTICATION);
        }
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (expiryTime.before(new Date()) || !tokenService.exist(token)) {
            throw new AppException(ErrorCode.NOT_AUTHENTICATION);
        }
        else{
            System.out.println("123123123123");
        }
    }


    public boolean checkToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);
        return verified && expiryTime.after(new Date()) && tokenService.exist(token);
    }

    //generate token from user
    public String generateToken(UserEntity user) throws JOSEException {

        tokenService.deleteByUser(user);

        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        System.err.println(jwsHeader);

        JWTClaimsSet jwtClaimsSet = generateJWTClaimSet(user);
        System.err.println(jwtClaimsSet);


        JWSObject jwsObject = new JWSObject(jwsHeader, new Payload(jwtClaimsSet.toJSONObject()));
        jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));

        String token =  jwsObject.serialize();

        return tokenService.save(token, user);
    }

    public JWTClaimsSet generateJWTClaimSet(UserEntity user){
        if(user.getRoles().size() == 1){
            return new JWTClaimsSet.Builder()
                    .issuer("hoangtuyen.com")
                    .subject(user.getId())
                    .issueTime(new Date())
                    .expirationTime(Date.from(Instant.now().plus(24*60*60, ChronoUnit.SECONDS)))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("roles",buildRoles(user.getRoles()))
                    .claim("scope", buildAuthorities(user.getRoles()))
                    .build();
        }
        else{
            return new JWTClaimsSet.Builder()
                    .issuer("hoangtuyen.com")
                    .subject(user.getId())
                    .issueTime(new Date())
                    .expirationTime(Date.from(Instant.now().plus(24*60*60*100, ChronoUnit.SECONDS)))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("roles",buildRoles(user.getRoles()))
                    .claim("scope", buildAuthorities(user.getRoles()))
                    .build();
        }
    }

    //build list Roles for claim roles
    private List<String> buildRoles(Set<RoleEntity> roles){
        List<String> list = new ArrayList<>();
        for(RoleEntity role : roles) list.add(role.getRoleName());
        return list;
    }

    //Build list authorities for claim authorities
    private List<String> buildAuthorities(Set<RoleEntity> roles){
        List<String> list = new ArrayList<>();
        for(RoleEntity role : roles)
            for(Authority auth : role.getAuthorities())
                list.add(auth.getName());
        return list;
    }
}
