package com.kma.shop.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class UserEntity extends FormEntity{
    @Column(nullable = false)
    String customId;
    @Column(nullable = false)
    String userName;
    @Column(nullable = false)
    String password;
    String imageLink;
    String email;
    String phone;
    String bio;
    Date dob;
    String address;


    @OneToOne
    CartEntity cart;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name ="role_id")
    )
    Set<RoleEntity> roles;


}


