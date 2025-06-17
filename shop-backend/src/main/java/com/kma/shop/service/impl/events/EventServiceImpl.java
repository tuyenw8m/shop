package com.kma.shop.service.impl.events;

import com.kma.shop.dto.request.EventCreationRequest;
import com.kma.shop.dto.request.ProductPromotionRequest;
import com.kma.shop.dto.response.EventResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.dto.response.ProductEventResponse;
import com.kma.shop.entity.EventEntity;
import com.kma.shop.entity.EventImageEntity;
import com.kma.shop.entity.ProductEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.repo.EventRepo;
import com.kma.shop.service.interfaces.ImageService;
import com.kma.shop.service.interfaces.ProductServiceV2;
import com.kma.shop.service.interfaces.events.EventImageService;
import com.kma.shop.service.interfaces.events.EventService;
import com.kma.shop.specification.EventSpecification;
import com.kma.shop.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level =  AccessLevel.PRIVATE, makeFinal=true)
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    EventRepo eventRepo;
    EventImageService eventImageService;
    ProductServiceV2 productServiceV2;
    ImageService imageService;

    @Override
    public boolean deleteByIds(List<String> ids){
        if(ids == null || ids.isEmpty()) return true;
        ids.forEach(this::deleteById);
        return true;
    }

    @Override
    @Transactional
    public boolean deleteById(String id){
        if(id == null || id.isEmpty()) return true;
        EventEntity eventEntity = eventRepo.findById(id).orElse(null);
        assert eventEntity != null;
        List<ProductEntity> products = eventEntity.getEventProducts();
        products.forEach(productEntity -> {
            productEntity.setEndEvent(LocalDate.now().minusDays(1));
            productEntity.setStartEvent(LocalDate.now().minusDays(1));
            productEntity.setEvent(null);});
        eventRepo.deleteById(id);
        return true;
    }

    @Override
    public PageResponse<EventResponse> getAllEvents(LocalDate from, LocalDate to, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("startDate").descending());
        Specification<EventEntity> spec = Specification
                .where(EventSpecification.startAfter(from))
                .and(EventSpecification.endBefore(to));

        Page<EventEntity> response = eventRepo.findAll(spec, pageable);
        return  PageResponse.<EventResponse>builder()
                .content(response.getContent().stream().map(this::toEventResponse).toList())
                .totalElements(response.getTotalElements())
                .totalPages(response.getTotalPages())
                .pageNumber(page + 1)
                .pageSize(limit)
                .build();
    }

    @Override
    public EventResponse getById(String id){
        if(id == null) return null;
        EventEntity eventEntity = eventRepo.findById(id).orElse(null);
        return toEventResponse(eventEntity);
    }

    @Transactional
    @Override
    public EventResponse update(String eventId, EventCreationRequest request) throws AppException {
        if(request == null ) throw new AppException(ErrorCode.INVALID_INPUT);

        List<ProductEntity> productEntities
                = buildProduct(request.getProducts(), request.getStartDate(), request.getEndDate());

        EventEntity entity = eventRepo.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_INPUT));
        entity.setTitle(request.getTitle());
        entity.setContent(request.getContent());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());

        entity.getEventProducts().forEach(productEntity -> {productEntity.setEvent(null);});
        entity.getImages().clear();

        setImage(request.getImages(), entity);

        productEntities.forEach(a -> a.setEvent(entity));
        eventRepo.save(entity);
        return toEventResponse(entity);
    }

    @Transactional
    @Override
    public EventResponse create(EventCreationRequest request) throws AppException {
        if(request == null ) throw new AppException(ErrorCode.INVALID_INPUT);

        List<ProductEntity> productEntities =
                buildProduct(request.getProducts(), request.getStartDate(), request.getEndDate());

        EventEntity entity = EventEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .endDate(request.getEndDate())
                .startDate(request.getStartDate())
                .eventProducts(productEntities)
                .build();

        setImage(request.getImages(), entity);
        productEntities.forEach(a -> a.setEvent(entity));
        eventRepo.save(entity);
        return toEventResponse(entity);
    }


    @Override
    public void setImage(List<MultipartFile> images, EventEntity entity){
        if(images == null || images.isEmpty()) return;
        if(entity == null) return;

        List<String> imageUrls = imageService.uploads(images);
        List<EventImageEntity> eventImageEntities = eventImageService.createEventImageEntities(entity, imageUrls);
        entity.setImages(eventImageEntities);
    }

    @Override
    public List<ProductEntity> buildProduct(List<ProductPromotionRequest> request, LocalDate start, LocalDate end) throws AppException {
        if(request == null || request.isEmpty()) return List.of();

        List<ProductEntity> productEntities = new ArrayList<>();
        for(ProductPromotionRequest productPromotionRequest : request){
            ProductEntity productEntity = productServiceV2.findById(productPromotionRequest.getProductId());
            if(productEntity == null){
                throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
            }
            productEntity.setPromotionPercent(productPromotionRequest.getPromotionPercent());
            productEntity.setEndEvent(end);
            productEntity.setStartEvent(start);
            productEntities.add(productEntity);
        }
        return productEntities;
    }

    @Override
    public EventResponse toEventResponse(EventEntity entity){
        if(entity == null) return null;

        return EventResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .endDate(entity.getEndDate())
                .startDate(entity.getStartDate())
                .images(entity.getImages() == null ?
                        null : entity.getImages().stream().map(EventImageEntity::getUrl).toList())
                .products(toProductEventResponses(entity.getEventProducts()))
                .build();
    }

    @Override
    public List<ProductEventResponse> toProductEventResponses(List<ProductEntity> entities){
        if(entities == null || entities.isEmpty()) return null;

        return entities.stream().map(this::toProductEventResponse).collect(Collectors.toList());
    }

    @Override
    public ProductEventResponse toProductEventResponse(ProductEntity entity){
        if(entity == null) return null;

        return ProductEventResponse.builder()
                .productId(entity.getId())
                .price(entity.getPrice())
                .productName(entity.getName())
                .promotionPrice(entity.getPrice() * entity.getPromotionPercent() / 100)
                .promotionPercent(entity.getPromotionPercent())
                .build();
    }
}
