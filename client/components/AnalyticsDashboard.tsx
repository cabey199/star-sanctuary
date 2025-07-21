import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Activity,
  Target,
  Award,
  Zap,
} from "lucide-react";
import { AnalyticsData } from "../../shared/types";

interface AnalyticsDashboardProps {
  businessId?: string;
  userRole: "mother_admin" | "subadmin" | "client";
  dateRange: "7days" | "30days" | "90days" | "1year";
  onDateRangeChange: (range: string) => void;
}

interface QuickStats {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  customerRetention: number;
  peakHour: string;
  topService: string;
  growthRate: number;
  completionRate: number;
}

export default function AnalyticsDashboard({
  businessId,
  userRole,
  dateRange,
  onDateRangeChange,
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, [businessId, dateRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const endpoint = businessId
        ? `/api/businesses/${businessId}/analytics`
        : "/api/admin/analytics";

      const response = await fetch(`${endpoint}?period=${dateRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("clientAuthToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
        setQuickStats(data.quickStats);
      } else {
        setError("Failed to fetch analytics data");
      }
    } catch (err) {
      setError("Network error while fetching analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "90days":
        return "Last 3 Months";
      case "1year":
        return "Last Year";
      default:
        return "Last 30 Days";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || !quickStats) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">
            {userRole === "mother_admin"
              ? "Platform-wide analytics"
              : "Business performance insights"}
          </p>
        </div>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 3 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {quickStats.totalBookings.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {quickStats.growthRate >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      quickStats.growthRate >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatPercentage(Math.abs(quickStats.growthRate))}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    vs last period
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(quickStats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-gray-600">
                    Avg:{" "}
                    {formatCurrency(
                      quickStats.totalRevenue /
                        Math.max(quickStats.totalBookings, 1),
                    )}
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {quickStats.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                  <span className="text-sm text-gray-600">
                    {analytics.totalReviews} reviews
                  </span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPercentage(quickStats.completionRate)}
                </p>
                <div className="flex items-center mt-2">
                  <Target className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-gray-600">
                    No-show rate:{" "}
                    {formatPercentage(100 - quickStats.completionRate)}
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Popular Services
            </CardTitle>
            <CardDescription>
              Top performing services in {getDateRangeLabel(dateRange)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularServices.slice(0, 5).map((service, index) => {
                const totalRevenue = analytics.popularServices.reduce(
                  (sum, s) => sum + s.revenue,
                  0,
                );
                const percentage =
                  totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0;

                return (
                  <div key={service.serviceName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium">
                          {service.serviceName}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(service.revenue)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.count} bookings
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Peak Hours
            </CardTitle>
            <CardDescription>
              Busiest booking times in {getDateRangeLabel(dateRange)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.peakHours.slice(0, 6).map((hour, index) => {
                const maxCount = Math.max(
                  ...analytics.peakHours.map((h) => h.count),
                );
                const percentage =
                  maxCount > 0 ? (hour.count / maxCount) * 100 : 0;

                return (
                  <div key={hour.hour} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={index < 3 ? "default" : "outline"}
                          className="w-8 h-6 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{hour.hour}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{hour.count} bookings</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index < 3 ? "bg-primary" : "bg-gray-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Trends
          </CardTitle>
          <CardDescription>
            Booking and revenue trends over {getDateRangeLabel(dateRange)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend, index) => (
              <div
                key={trend.month}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{trend.month}</p>
                  <p className="text-sm text-gray-600">Month</p>
                </div>
                <div>
                  <p className="font-medium">{trend.bookings} bookings</p>
                  <p className="text-sm text-gray-600">
                    {index > 0 && (
                      <>
                        {trend.bookings >=
                        analytics.monthlyTrends[index - 1].bookings ? (
                          <TrendingUp className="w-4 h-4 inline text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 inline text-red-600 mr-1" />
                        )}
                        vs previous month
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{formatCurrency(trend.revenue)}</p>
                  <p className="text-sm text-gray-600">
                    {index > 0 && (
                      <>
                        {trend.revenue >=
                        analytics.monthlyTrends[index - 1].revenue ? (
                          <TrendingUp className="w-4 h-4 inline text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 inline text-red-600 mr-1" />
                        )}
                        vs previous month
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="font-medium">
                  {formatPercentage(quickStats.customerRetention)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak Hour</span>
                <span className="font-medium">{quickStats.peakHour}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Top Service</span>
                <span className="font-medium text-sm">
                  {quickStats.topService}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <Badge
                  variant={
                    quickStats.completionRate >= 90 ? "default" : "secondary"
                  }
                >
                  {formatPercentage(quickStats.completionRate)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Rating</span>
                <Badge
                  variant={
                    quickStats.averageRating >= 4.5 ? "default" : "secondary"
                  }
                >
                  {quickStats.averageRating.toFixed(1)} ★
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <Badge
                  variant={
                    quickStats.growthRate >= 0 ? "default" : "destructive"
                  }
                >
                  {quickStats.growthRate >= 0 ? "+" : ""}
                  {formatPercentage(quickStats.growthRate)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                Export Analytics Report
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                View Detailed Reports
              </button>
              <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                Schedule Email Report
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
