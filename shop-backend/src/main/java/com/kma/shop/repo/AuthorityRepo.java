package com.kma.shop.repo;

import com.kma.shop.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorityRepo extends JpaRepository<Authority, String> {
    boolean existsByName(String name);
    Authority findByName(String name);
    boolean deleteByName(String name);
}
