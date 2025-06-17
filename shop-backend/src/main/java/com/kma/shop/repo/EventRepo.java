package com.kma.shop.repo;

import com.kma.shop.entity.EventEntity;
import com.kma.shop.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<EventEntity, String> {
    Page<EventEntity> findAll(Specification<EventEntity> spec, Pageable pageable);
}
