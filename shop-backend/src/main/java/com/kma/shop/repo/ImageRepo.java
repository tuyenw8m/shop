package com.kma.shop.repo;

import com.kma.shop.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepo  extends JpaRepository<ImageEntity, String> {
}
