package com.kma.shop.service.interfaces.events;

import com.kma.shop.dto.request.EventCreationRequest;
import com.kma.shop.dto.request.ProductPromotionRequest;
import com.kma.shop.dto.response.EventResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductEventResponse;
import com.kma.shop.entity.EventEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.exception.AppException;
import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface EventService {

    boolean deleteByIds(List<String> ids);

    boolean deleteById(String id);

    PageResponse<EventResponse> getAllEvents(LocalDate from, LocalDate to, int page, int limit);

    EventResponse getById(String id);

    @Transactional
    EventResponse update(String eventId, EventCreationRequest request) throws AppException;

    @Transactional
    EventResponse create(EventCreationRequest request) throws AppException;

    void setImage(List<MultipartFile> images, EventEntity entity);

    List<ProductEntity> buildProduct(List<ProductPromotionRequest> request, LocalDate start, LocalDate end) throws AppException;

    EventResponse toEventResponse(EventEntity entity);

    List<ProductEventResponse> toProductEventResponses(List<ProductEntity> entities);

    ProductEventResponse toProductEventResponse(ProductEntity entity);
}
