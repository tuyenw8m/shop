"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  RefreshCcw,
  MapPin,
  Activity,
} from "lucide-react";
import { apiClient } from "@/lib/api";

interface MonthlyRevenueData {
  month: number;
  revenue: number;
  orderCount: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface DashboardSummary {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  topCustomers: { name: string; total: number }[];
  refunds: { count: number; value: number };
  salesByRegion: { region: string; sales: number }[];
  recentActivities: { type: string; text: string; time: string }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<
    MonthlyRevenueData[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, monthlyRevenueRes] = await Promise.all([
          apiClient.getDashboardSummary(),
          apiClient.getMonthlyRevenue(),
        ]);

        // Access the .data property of the Axios response
        setSummaryData(summaryRes.data);

        const formattedMonthlyData = monthlyRevenueRes.data.map(
          (item: MonthlyRevenueData) => ({
            ...item,
            month: `Thg ${item.month}`,
          })
        );
        setMonthlyRevenueData(formattedMonthlyData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phân tích:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg text-gray-600">
              Đang tải dữ liệu phân tích...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-gray-600">Không có dữ liệu để hiển thị.</p>
        </div>
      </div>
    );
  }

  const categoryData: CategoryData[] = [
    { name: "Điện thoại", value: 35, color: "#3B82F6" },
    { name: "Laptop", value: 25, color: "#8B5CF6" },
    { name: "Phụ kiện", value: 20, color: "#10B981" },
    { name: "Tablet", value: 15, color: "#F59E0B" },
    { name: "Khác", value: 5, color: "#EF4444" },
  ];

  const topProducts: TopProduct[] = [
    { name: "iPhone 15 Pro Max", sold: 245, revenue: 610000000 },
    { name: "MacBook Air M2", sold: 189, revenue: 472500000 },
    { name: "Samsung Galaxy S24", sold: 156, revenue: 312000000 },
    { name: "iPad Pro", sold: 134, revenue: 268000000 },
    { name: "AirPods Pro", sold: 298, revenue: 149000000 },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Phân tích & Báo cáo
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatPrice(summaryData.totalRevenue)}
            </div>
            <p className="text-xs text-blue-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Dữ liệu gần nhất
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Tổng đơn hàng
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatNumber(summaryData.totalOrders)}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              {summaryData.pendingOrders > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
                  {formatNumber(summaryData.pendingOrders)} đơn chờ xử lý
                </>
              ) : (
                "Không có đơn chờ xử lý"
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Tổng khách hàng
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatNumber(summaryData.totalUsers)}
            </div>
            <p className="text-xs text-purple-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Tổng số khách hàng
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Tổng sản phẩm
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatNumber(summaryData.totalProducts)}
            </div>
            <p className="text-xs text-orange-600 flex items-center">
              {summaryData.lowStockProducts > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {formatNumber(summaryData.lowStockProducts)} sản phẩm sắp hết
                  hàng
                </>
              ) : (
                "Đủ hàng trong kho"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Hoàn tiền
            </CardTitle>
            <RefreshCcw className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatPrice(summaryData.refunds.value)}
            </div>
            <p className="text-xs text-red-600 flex items-center">
              {formatNumber(summaryData.refunds.count)} giao dịch hoàn tiền
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Doanh số theo vùng
            </CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summaryData.salesByRegion.map((data, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{data.region}:</span>
                  <span className="font-medium text-purple-900">
                    {formatPrice(data.sales)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Doanh thu theo tháng
            </CardTitle>
            <CardDescription>
              Doanh thu và số đơn hàng 6 tháng gần nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#3B82F6"
                  tickFormatter={(value) => formatPrice(value as number)}
                />
                <YAxis yAxisId="right" orientation="right" stroke="#8B5CF6" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatPrice(value as number) : value,
                    name === "revenue" ? "Doanh thu" : "Đơn hàng",
                  ]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#3B82F6"
                  name="revenue"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orderCount"
                  fill="#8B5CF6"
                  name="orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Phân bố danh mục
            </CardTitle>
            <CardDescription>
              Tỷ lệ bán hàng theo danh mục sản phẩm (Dữ liệu mẫu)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Sản phẩm bán chạy
          </CardTitle>
          <CardDescription>
            Top 5 sản phẩm có doanh số cao nhất (Dữ liệu mẫu)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Đã bán: {formatNumber(product.sold)} sản phẩm
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {formatPrice(product.revenue)}
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Bán chạy
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Khách hàng tiêu biểu
          </CardTitle>
          <CardDescription>
            Top khách hàng có tổng chi tiêu cao nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryData.topCustomers.map((customer, index) => (
              <div
                key={customer.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">
                    {formatPrice(customer.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Hoạt động gần đây
          </CardTitle>
          <CardDescription>
            Các hoạt động mới nhất trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summaryData.recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {activity.type === "order" && (
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                )}
                {activity.type === "review" && (
                  <Users className="h-5 w-5 text-purple-500" />
                )}
                {activity.type === "stock" && (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <div className="font-medium text-gray-800">
                    {activity.text}
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Xu hướng đơn hàng
          </CardTitle>
          <CardDescription>Số lượng đơn hàng theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
