package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.EventCreationRequest;
import com.kma.shop.dto.response.EventResponse;
import com.kma.shop.dto.response.PageResponse;
import com.kma.shop.exception.AppException;
import com.kma.shop.exception.ErrorCode;
import com.kma.shop.service.interfaces.events.EventService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventController {
    EventService eventService;

    @GetMapping("/{id}")
    public ApiResponse<EventResponse> getEvent(@PathVariable String id) {
        return ApiResponse.<EventResponse>builder()
                .data(eventService.getById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<EventResponse>> getAllEvents(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit
    ) throws AppException {
        LocalDate startDate = LocalDate.now().minusYears(100);
        LocalDate endDate = LocalDate.now().plusYears(100);

        // Kiểm tra và parse ngày
        try {
            if (from != null && !from.trim().isEmpty()) {
                startDate = LocalDate.parse(from); // ISO format: yyyy-MM-dd
            }
            if (to != null && !to.trim().isEmpty()) {
                endDate = LocalDate.parse(to);
            }
        } catch (DateTimeParseException e) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        PageResponse<EventResponse> events = eventService.getAllEvents(startDate, endDate, page - 1, limit);

        return ApiResponse.<PageResponse<EventResponse>>builder()
                .data(events)
                .build();
    }

    @PostMapping
    public ApiResponse<EventResponse> addEvent(@ModelAttribute EventCreationRequest eventRequest) throws AppException {
        return ApiResponse.<EventResponse>builder()
                .data(eventService.create(eventRequest))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<EventResponse> updateEvent(@ModelAttribute EventCreationRequest eventRequest, @PathVariable String id) throws AppException {
        return ApiResponse.<EventResponse>builder()
                .data(eventService.update(id, eventRequest))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> deleteEvent(@PathVariable String id) {
        return ApiResponse.<Boolean>builder()
                .data(eventService.deleteById(id))
                .build();
    }
}
