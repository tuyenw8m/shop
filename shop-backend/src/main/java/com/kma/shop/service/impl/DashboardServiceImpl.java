package com.kma.shop.service.impl;

import com.kma.shop.dto.response.DashboardSummaryResponse;
import com.kma.shop.dto.response.MonthlyRevenueResponse;
import com.kma.shop.service.interfaces.DashboardService;
import com.kma.shop.service.interfaces.ProductServiceV2;
import com.kma.shop.service.interfaces.OrderService;
import com.kma.shop.service.interfaces.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {
    private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);
    private final ProductServiceV2 productServiceV2;
    private final OrderService orderService;
    private final UserService userService;

    public DashboardServiceImpl(ProductServiceV2 productServiceV2, OrderService orderService, UserService userService) {
        this.productServiceV2 = productServiceV2;
        this.orderService = orderService;
        this.userService = userService;
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        DashboardSummaryResponse resp = new DashboardSummaryResponse();
        resp.setTotalProducts(productServiceV2.count());
        resp.setTotalUsers((int) userService.count());
        resp.setTotalOrders((int) orderService.count());
        resp.setTotalRevenue((long) orderService.countTotalPrice());
        resp.setPendingOrders(23);
        resp.setLowStockProducts(8);

        DashboardSummaryResponse.TopCustomer c1 = new DashboardSummaryResponse.TopCustomer();
        c1.setName("Nguyễn Văn A"); c1.setTotal(12000000L);
        DashboardSummaryResponse.TopCustomer c2 = new DashboardSummaryResponse.TopCustomer();
        c2.setName("Trần Thị B"); c2.setTotal(9500000L);
        DashboardSummaryResponse.TopCustomer c3 = new DashboardSummaryResponse.TopCustomer();
        c3.setName("Lê Văn C"); c3.setTotal(8700000L);
        resp.setTopCustomers(Arrays.asList(c1, c2, c3));

        DashboardSummaryResponse.RefundSummary refunds = new DashboardSummaryResponse.RefundSummary();
        refunds.setCount(3); refunds.setValue(3500000L);
        resp.setRefunds(refunds);

        DashboardSummaryResponse.SalesByRegion r1 = new DashboardSummaryResponse.SalesByRegion();
        r1.setRegion("Hà Nội"); r1.setSales(50000000L);
        DashboardSummaryResponse.SalesByRegion r2 = new DashboardSummaryResponse.SalesByRegion();
        r2.setRegion("Hồ Chí Minh"); r2.setSales(42000000L);
        DashboardSummaryResponse.SalesByRegion r3 = new DashboardSummaryResponse.SalesByRegion();
        r3.setRegion("Đà Nẵng"); r3.setSales(15000000L);
        resp.setSalesByRegion(Arrays.asList(r1, r2, r3));

        DashboardSummaryResponse.RecentActivity a1 = new DashboardSummaryResponse.RecentActivity();
        a1.setType("order"); a1.setText("Đơn hàng mới từ Nguyễn Văn A"); a1.setTime("1 phút trước");
        DashboardSummaryResponse.RecentActivity a2 = new DashboardSummaryResponse.RecentActivity();
        a2.setType("review"); a2.setText("Đánh giá mới cho sản phẩm Camera"); a2.setTime("5 phút trước");
        DashboardSummaryResponse.RecentActivity a3 = new DashboardSummaryResponse.RecentActivity();
        a3.setType("stock"); a3.setText("Sản phẩm Laptop sắp hết hàng"); a3.setTime("10 phút trước");
        resp.setRecentActivities(Arrays.asList(a1, a2, a3));

        logger.info("Dashboard summary: {}", resp);
        return resp;
    }

    @Override
    public List<MonthlyRevenueResponse> getMonthlyRevenue() {
        return Arrays.asList(
            new MonthlyRevenueResponse(1, 4000000L, 240),
            new MonthlyRevenueResponse(2, 3000000L, 139),
            new MonthlyRevenueResponse(3, 2000000L, 980),
            new MonthlyRevenueResponse(4, 2780000L, 390),
            new MonthlyRevenueResponse(5, 1890000L, 480),
            new MonthlyRevenueResponse(6, 2390000L, 380)
        );
    }
} 