package com.kma.shop.mapping;

import com.kma.shop.dto.request.BranchCreationRequest;
import com.kma.shop.dto.response.BranchResponse;
import com.kma.shop.entity.BranchEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component

public class BranchMapping {
    public BranchEntity toBranchEntity(BranchCreationRequest request){
        return BranchEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public List<BranchEntity> toBranchEntities(List<BranchCreationRequest> requests){
        return requests.stream().map(this::toBranchEntity).collect(Collectors.toList());
    }

    public BranchResponse toBranchResponse(BranchEntity entity){
        return BranchResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }

    public List<BranchResponse> toBranchResponses(List<BranchEntity> entities){
        return entities.stream().map(this::toBranchResponse).collect(Collectors.toList());
    }
}
