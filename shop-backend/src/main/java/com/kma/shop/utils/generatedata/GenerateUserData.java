package com.kma.shop.utils.generatedata;

import com.github.javafaker.Faker;
import com.kma.shop.entity.RoleEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.mapping.UserMapping;
import com.kma.shop.repo.RoleRepo;
import com.kma.shop.repo.UserRepo;
import com.kma.shop.service.impl.RoleService;
import com.kma.shop.service.interfaces.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GenerateUserData {
    UserRepo userRepo;
    Faker faker;
    RoleRepo roleRepo;
    UserMapping userMapping;
    Random random = new Random();

    static String EMAIL_BASE = "userbase";
    static String EMAIL_TAIL = "@gmail.com";
    static String PASSWORD = "password";

    public void generate() throws AppException {
        if(userRepo.count() < 1){
            Set<RoleEntity> roles = getUserRole();
            List<UserEntity> users = new ArrayList<>(100);
            for(int i = 0; i < 100; i++){
                UserEntity entity = userMapping.buildUserBase(generateEmail(), generatePhone(),
                        generateName(), generatePassword(), generateAddress(), "", roles);
                users.add(entity);
            }
            userRepo.saveAll(users);
        }
    }

    private Set<RoleEntity> getUserRole() throws AppException {
        return Set.of(Objects.requireNonNull(roleRepo.findByRoleName("USER").orElse(null)));
    }

    private String generateEmail(){
        return EMAIL_BASE + random.nextInt(1000000) +  EMAIL_TAIL;
    }

    private String generatePassword(){
        return PASSWORD;
    }

    private String generatePhone(){
        StringBuilder phone = new StringBuilder("03");
        for(int i = 0; i < 8; i++){
            phone.append(random.nextInt(10));
        }
        return phone.toString();
    }

    private String generateAddress(){
        return faker.address().fullAddress();
    }

    private String generateName(){
        return faker.name().fullName();
    }

}
