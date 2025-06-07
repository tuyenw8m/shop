package com.kma.shop.repo;

import com.kma.shop.entity.EventProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventProductRepo extends JpaRepository<EventProductEntity, String> {
}
