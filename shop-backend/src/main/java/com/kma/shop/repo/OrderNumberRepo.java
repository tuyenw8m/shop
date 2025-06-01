package com.kma.shop.repo;

import com.kma.shop.entity.OrderNumberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderNumberRepo extends JpaRepository<OrderNumberEntity, String>, JpaSpecificationExecutor<OrderNumberEntity> {
}
