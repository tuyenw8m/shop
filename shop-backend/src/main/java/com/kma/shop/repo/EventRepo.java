package com.kma.shop.repo;

import com.kma.shop.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepo extends JpaRepository<EventEntity, String> {
}
