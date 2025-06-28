package com.kma.shop.specification;

import com.kma.shop.entity.*;
import com.kma.shop.enums.EntityStatus;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

public class ProductSpecification {

    public static Specification<ProductEntity> topSoldWeek() {
        return (root, query, criteriaBuilder) -> {
            // Chỉ thực hiện distinct khi query là dạng truy vấn select (không count)
            if (query.getResultType() != Long.class) {
                query.distinct(true);
            }
            return criteriaBuilder.greaterThan(
                    root.join("orders").get("creationDate"),
                    LocalDate.now().minusDays(7)
            );
        };
    }

    public static Specification<ProductEntity> hasName(String name){
        return (name == null || name.isBlank()) ? null : (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<ProductEntity> hasEntityStatus(List<EntityStatus> status){
        return (status == null || status.isEmpty()) ? null : (root, query, cb) ->
                root.get("entityStatus").in(status);
    }

    public static Specification<ProductEntity> hasPriceBetween(float min, float max){
        return (root, query, cb) ->
                cb.between(root.get("price"), min, max);
    }

    public static Specification<ProductEntity> hasParentCategory(ParentCategoryEntity category){
        return (category == null) ? null : (root, query, cb) ->
                cb.equal(root.get("parentCategory"), category);
    }


    public static Specification<ProductEntity> hasCategory(CategoryEntity category){
        return (category == null) ? null :(root, query, cb) ->
                cb.isMember(category, root.get("categories"));
    }

    public static Specification<ProductEntity> hasBranch(BranchEntity branch){
        return (branch == null) ? null :(root, query, cb) ->
                cb.equal( root.get("branch"), branch);
    }


    public static Specification<ProductEntity> hasChildren(ChildCategoryEntity children){
        return (children == null) ? null :(root, query, cb) ->
                cb.isMember(children, root.get("childCategories"));
    }
    public static Specification<ProductEntity> hasAnyChild(List<ChildCategoryEntity> children) {
        return (children == null || children.isEmpty()) ? null : (root, query, cb) -> {
            Join<ProductEntity, ChildCategoryEntity> join = root.join("childCategories", JoinType.INNER);
            return join.in(children);
        };
    }
    public static Specification<ProductEntity> hasAllChildren(List<ChildCategoryEntity> children) {
        return (children == null || children.isEmpty()) ? null : (root, query, cb) -> {
            // Bắt buộc DISTINCT để không bị duplicate khi join
            query.distinct(true);

            // Join với child categories
            Join<ProductEntity, ChildCategoryEntity> join = root.join("childCategories", JoinType.INNER);

            // Group by product để dùng having
            query.groupBy(root.get("id"));

            // Tạo điều kiện where: child IN (input)
            Predicate predicate = join.in(children);

            // Having: count(distinct child.id) = size of input list
            Expression<Long> count = cb.countDistinct(join.get("id"));
            query.having(cb.equal(count, (long) children.size()));

            return predicate;
        };
    }
}
