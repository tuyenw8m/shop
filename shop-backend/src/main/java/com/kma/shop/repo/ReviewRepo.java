package com.kma.shop.repo;

import com.kma.shop.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository

public interface ReviewRepo extends JpaRepository<ReviewEntity, String>, JpaSpecificationExecutor<ReviewEntity> {
}
