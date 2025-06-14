package com.kma.shop.repo;

import com.kma.shop.entity.BranchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BranchRepo extends JpaRepository<BranchEntity, String> {
    @Modifying
    @Query("DELETE FROM BranchEntity  b WHERE b.name = :branchName")
    void deleteByName(String branchName);
    Optional<BranchEntity> findByName(String branchName);
    boolean existsByName(String branchName);
}
