package com.kma.shop.entity;

import com.kma.shop.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ordernumer")
public class OrderNumberEntity extends  FormEntity {
    private int number;
    private Status status;
    @ManyToOne
    private ProductEntity product;
    @ManyToOne
    private UserOrderProductEntity orderProduct;
}
