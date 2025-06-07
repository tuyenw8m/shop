package com.kma.shop.service.interfaces;

import com.kma.shop.entity.Authority;

public interface AuthorityService {
    Authority getAuthorityByName(String name);

    boolean existsAuthorityName(String name);

    boolean deleteAuthorityByName(String name);
}
