package com.kma.shop.service.interfaces;

import com.kma.shop.dto.response.DashboardSummaryResponse;
import com.kma.shop.dto.response.MonthlyRevenueResponse;
import java.util.List;

public interface DashboardService {
    DashboardSummaryResponse getDashboardSummary();
    List<MonthlyRevenueResponse> getMonthlyRevenue();
} 