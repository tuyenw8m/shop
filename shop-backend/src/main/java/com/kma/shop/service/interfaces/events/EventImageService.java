package com.kma.shop.service.interfaces.events;

import com.kma.shop.entity.EventEntity;
import com.kma.shop.entity.EventImageEntity;

import java.util.List;

public interface EventImageService {
    EventImageEntity createEventImageEntity(EventEntity eventEntity, String url);

    List<EventImageEntity> createEventImageEntities(EventEntity eventEntity, List<String> urls);
}
