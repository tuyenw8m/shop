package com.kma.shop.repo;

import com.kma.shop.entity.BranchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BranchRepo extends JpaRepository<BranchEntity, String> {
    void deleteByName(String branchName);
    BranchEntity findByName(String branchName);

}
