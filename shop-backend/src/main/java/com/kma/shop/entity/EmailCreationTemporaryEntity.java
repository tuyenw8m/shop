package com.kma.shop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class EmailCreationTemporaryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String customId;
    String userName;
    String password;
    String email;
    String phone;
    String bio;
    Date dob;
    String address;
}
