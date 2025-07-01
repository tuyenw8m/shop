package com.kma.shop.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DashboardSummaryResponse {
    private int totalProducts;
    private int totalUsers;
    private int totalOrders;
    private long totalRevenue;
    private int pendingOrders;
    private int lowStockProducts;
    private List<TopCustomer> topCustomers;
    private RefundSummary refunds;
    private List<SalesByRegion> salesByRegion;
    private List<RecentActivity> recentActivities;

    // Getters and setters
    // ...

    @Getter
    @Setter
    public static class TopCustomer {
        private String name;
        private long total;
        // Getters and setters
    }
    @Getter
    @Setter
    public static class RefundSummary {
        private int count;
        private long value;
        // Getters and setters
    }
    @Getter
    @Setter
    public static class SalesByRegion {
        private String region;
        private long sales;
        // Getters and setters
    }
    @Getter
    @Setter
    public static class RecentActivity {
        private String type;
        private String text;
        private String time;
        // Getters and setters
    }
} 