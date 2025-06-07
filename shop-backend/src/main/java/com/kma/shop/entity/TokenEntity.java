package com.kma.shop.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.w3c.dom.Text;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "tokens")
public class TokenEntity extends  FormEntity{
    @Column(columnDefinition = "TEXT", nullable = false)
    String token;

    @OneToOne(fetch = FetchType.LAZY)
    UserEntity user;
}
