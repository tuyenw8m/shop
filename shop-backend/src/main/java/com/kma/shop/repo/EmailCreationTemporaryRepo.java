package com.kma.shop.repo;

import com.kma.shop.entity.EmailCreationTemporaryEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailCreationTemporaryRepo extends JpaRepository<EmailCreationTemporaryEntity, String> {
    @Transactional
    @Modifying
    @Query("DELETE FROM EmailCreationTemporaryEntity s WHERE s.email = :email")
    int deleteByEmail(@Param("email") String email);
    Optional<EmailCreationTemporaryEntity> findByEmail(String email);
}
