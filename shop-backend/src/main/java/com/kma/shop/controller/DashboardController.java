package com.kma.shop.controller;

import com.kma.shop.dto.response.DashboardSummaryResponse;
import com.kma.shop.dto.response.MonthlyRevenueResponse;
import com.kma.shop.service.interfaces.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryResponse getDashboardSummary() {
        return dashboardService.getDashboardSummary();
    }

    @GetMapping("/monthly-revenue")
    public List<MonthlyRevenueResponse> getMonthlyRevenue() {
        return dashboardService.getMonthlyRevenue();
    }
} 