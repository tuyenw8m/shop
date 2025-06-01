package com.kma.shop.repo;

import com.kma.shop.entity.UserOrderProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserOrderProductRepo extends JpaRepository<UserOrderProductEntity, String>, JpaSpecificationExecutor<UserOrderProductEntity> {
}
