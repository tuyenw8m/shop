package com.kma.shop.entity;
import com.kma.shop.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;

import java.util.List;


@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "UserOrderProductEntity")
public class UserOrderProductEntity extends FormEntity{
    @OneToMany
    private List<OrderNumberEntity> orderNumbers;
    @OneToOne
    private UserEntity user;
}
