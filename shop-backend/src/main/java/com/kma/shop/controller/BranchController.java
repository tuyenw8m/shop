package com.kma.shop.controller;

import com.kma.shop.dto.ApiResponse;
import com.kma.shop.dto.request.BranchCreationRequest;
import com.kma.shop.dto.response.BranchResponse;
import com.kma.shop.entity.BranchEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.service.interfaces.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/branches")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class BranchController {
    BranchService branchService;

    @GetMapping
    public ApiResponse<List<BranchResponse>> getBranches(@RequestParam(required = false) List<String> names)
            throws AppException {
        return ApiResponse.<List<BranchResponse>>builder()
                .data(branchService.getByNames(names))
                .build();
    }

    @DeleteMapping("/{name}")
    public ApiResponse<Void> deleteBranch(@PathVariable String name) throws AppException {
        branchService.deleteByName(name);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BranchResponse> create(@RequestBody BranchCreationRequest request) throws AppException {
        return ApiResponse.<BranchResponse>builder()
                .data(branchService.create(request))
                .build();
    }

    @PutMapping("/{name}")
    public ApiResponse<BranchResponse> update(@RequestBody BranchCreationRequest request,
                                              @PathVariable String name) throws AppException {
        return ApiResponse.<BranchResponse>builder()
                .data(branchService.update(request, name))
                .build();
    }
}
