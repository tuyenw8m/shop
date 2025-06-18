package com.kma.shop.service.impl.events;

import com.kma.shop.entity.EventEntity;
import com.kma.shop.entity.EventImageEntity;
import com.kma.shop.repo.AmazonS3Client;
import com.kma.shop.repo.EventRepo;
import com.kma.shop.service.interfaces.ImageService;
import com.kma.shop.service.interfaces.events.EventImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class EvenImageServiceImpl implements EventImageService {
    EventRepo eventRepo;


    @Override
    public EventImageEntity createEventImageEntity(EventEntity eventEntity, String url) {
        return EventImageEntity.builder()
                .event(eventEntity)
                .url(url)
                .build();
    }

    @Override
    public List<EventImageEntity> createEventImageEntities(EventEntity eventEntity, List<String> urls){
        return urls.stream().map(url -> createEventImageEntity(eventEntity, url)).toList();
    }

}
