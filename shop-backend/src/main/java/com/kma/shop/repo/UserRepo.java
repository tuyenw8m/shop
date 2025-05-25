package com.kma.shop.repo;


import com.kma.shop.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, String> {
    boolean existsByCustomId(String userId);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByPhone(String phone);
    Optional<UserEntity> findByCustomId(String userId);
    Page<UserEntity> findByCustomIdContaining(String customId,Pageable pageable);

    @Query(value = "SELECT u.id, u.custom_id, u.user_name, u.image_link, " +
            "CASE " +
                "WHEN f.friendship IS NOT NULL AND u.id = f.sender AND f.friendship = 'PENDING' THEN 'WAITING' " +
                "WHEN f.friendship IS NOT NULL THEN f.friendship " +
                "ELSE NULL " +
            "END AS friendship " +
            "FROM users u LEFT JOIN friendship f " +
            "ON (u.id = f.sender AND f.receiver = :userId) " +
            "OR (u.id = f.receiver AND f.sender = :userId) " +
            "WHERE  u.custom_id REGEXP :regexp", nativeQuery = true)
    Page<Object[]> findFriendByCustomIdContaining(@Param("regexp") String regexp,
                                                                     @Param("userId") String userId,
                                                                     Pageable pageable);

}
