"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Users,
  ShoppingCart,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  AlertTriangle,
  Activity,
  MapPin,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// import { apiClient } from "@/lib/api"; // No longer needed for mock data
import { useToast } from "@/hooks/use-toast";

interface DashboardSummary {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  topCustomers: Array<{
    name: string;
    total: number;
  }>;
  refunds: {
    count: number;
    value: number;
  };
  salesByRegion: Array<{
    region: string;
    sales: number;
  }>;
  recentActivities: Array<{
    type: string;
    text: string;
    time: string;
  }>;
}

interface MonthlyRevenue {
  month: number; // Numeric month (1-12)
  revenue: number;
  orderCount: number;
  monthName?: string; // Add optional monthName for display
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- Mock Data ---
  const mockSummaryData: DashboardSummary = {
    totalProducts: 1250,
    totalUsers: 8750,
    totalOrders: 3200,
    totalRevenue: 25000000000, // 25 tỷ VND
    pendingOrders: 15,
    lowStockProducts: 8,
    topCustomers: [
      { name: "Nguyễn Văn A", total: 150000000 },
      { name: "Trần Thị B", total: 120000000 },
      { name: "Lê Văn C", total: 95000000 },
      { name: "Phạm Thị D", total: 80000000 },
      { name: "Hoàng Minh E", total: 70000000 },
    ],
    refunds: {
      count: 3,
      value: 5000000, // 5 triệu VND
    },
    salesByRegion: [
      { region: "Hà Nội", sales: 10000000000 },
      { region: "TP. Hồ Chí Minh", sales: 8000000000 },
      { region: "Đà Nẵng", sales: 3000000000 },
      { region: "Cần Thơ", sales: 2000000000 },
    ],
    recentActivities: [
      {
        type: "order",
        text: "Đơn hàng mới #AD1234 đã được đặt.",
        time: "Vừa xong",
      },
      {
        type: "review",
        text: "Khách hàng đánh giá iPhone 15 Pro Max 5 sao.",
        time: "5 phút trước",
      },
      {
        type: "stock",
        text: "Sản phẩm 'Tai nghe không dây XYZ' sắp hết hàng.",
        time: "1 giờ trước",
      },
      {
        type: "order",
        text: "Đơn hàng #AD1233 đã được vận chuyển.",
        time: "Hôm qua",
      },
      {
        type: "user",
        text: "Người dùng mới 'nguyenvana' đã đăng ký.",
        time: "2 ngày trước",
      },
    ],
  };

  const mockMonthlyRevenueData: MonthlyRevenue[] = [
    { month: 1, revenue: 1500000000, orderCount: 250 },
    { month: 2, revenue: 1800000000, orderCount: 280 },
    { month: 3, revenue: 2000000000, orderCount: 310 },
    { month: 4, revenue: 2300000000, orderCount: 350 },
    { month: 5, revenue: 2600000000, orderCount: 380 },
    { month: 6, revenue: 2900000000, orderCount: 420 },
  ];
  // --- End Mock Data ---

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSummary(mockSummaryData);

      const transformedData = mockMonthlyRevenueData.map(
        (item: MonthlyRevenue) => ({
          ...item,
          monthName: getMonthName(item.month),
        })
      );
      setMonthlyRevenue(transformedData);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu dashboard (dữ liệu mock)",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    return months[month - 1] || `T${month}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "stock":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "user": // Added a new case for user activity
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-600">
              Đang tải dữ liệu dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-gray-600">
            Không thể tải dữ liệu dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bảng điều khiển
        </h1>
        <p className="text-gray-600">
          Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Tổng sản phẩm
            </CardTitle>
            <Package className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalProducts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Người dùng
            </CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Đơn hàng
            </CardTitle>
            <ShoppingCart className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalOrders.toLocaleString()}
            </div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Doanh thu
            </CardTitle>
            <DollarSign className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalRevenue)}
            </div>
            <div className="flex items-center text-xs opacity-80 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart className="h-5 w-5 text-blue-600" />
                Doanh thu theo tháng
              </CardTitle>
              <CardDescription>
                Biểu đồ doanh thu và đơn hàng 6 tháng gần đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="monthName" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue"
                        ? formatCurrency(value as number)
                        : value,
                      name === "revenue" ? "Doanh thu" : "Đơn hàng",
                    ]}
                    labelStyle={{ color: "#333" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#revenueGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Eye className="h-5 w-5 text-green-600" />
                Thống kê nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Đơn hàng chờ xử lý
                </span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  {summary.pendingOrders}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sản phẩm sắp hết</span>
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-800"
                >
                  {summary.lowStockProducts}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hoàn trả</span>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {summary.refunds.count} đơn
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(summary.refunds.value)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mục tiêu tháng</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Activity className="h-5 w-5 text-purple-600" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Customers and Sales by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-blue-600" />
              Khách hàng VIP
            </CardTitle>
            <CardDescription>
              Top khách hàng có doanh số cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.topCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">Khách hàng VIP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(customer.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MapPin className="h-5 w-5 text-green-600" />
              Doanh số theo khu vực
            </CardTitle>
            <CardDescription>Phân bố doanh số theo địa phương</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.salesByRegion.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {region.region}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(region.sales)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (region.sales /
                            Math.max(
                              ...summary.salesByRegion.map((r) => r.sales)
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Trends */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Xu hướng đơn hàng
          </CardTitle>
          <CardDescription>Số lượng đơn hàng theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
              <Line
                type="monotone"
                dataKey="orderCount"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
