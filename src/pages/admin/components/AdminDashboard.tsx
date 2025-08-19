import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import {
  FaDoorOpen,
  FaConciergeBell,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';

import DashboardFilter from './DashBoardFilter';
import type { Revenue } from '@/services/revenueService';

export interface DateFilter {
  period: 'year' | 'month';
  year: number;
  month?: number;
}

export interface RevenueStats {
  totalRevenue: number;
  highestRevenue: number;
  lowestRevenue: number;
  currentMonth: string;
  previousMonth: string;
}

export type RoomStats = {
  totalRooms?: number;
  total?: number;
  available?: number;
  occupied?: number;
  maintenance?: number;
  reserved?: number;
};

export type ServiceStats = {
  totalVariations?: number;
  totalImages?: number;
  totalReviews?: number;
  totalServices?: number;
  priceRange?: { min: number; max: number } | null;
};

export type UserStats = {
  totalUsers?: number;
  activeUsers?: number;
  bannedUsers?: number;
  totalRoles?: number;
  lastLoginRange?: { earliest: string; latest: string } | null; // ISO date strings
};

export type EventStats = {
  total?: number;
};

export type InvoiceStats = {
  totalInvoices: number;
  totalAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  cancelledInvoices: number;
  overdueInvoices: number;
  refundedInvoices: number;
  totalPaidAmount: number;
  totalOverdueAmount: number;
};

// export type RevenueData = {
//   success?: boolean;
//   message?: string;
//   data?: { label?: string; revenue?: number | string }[];
// };

type AdminDashboardProps = {
  roomStats: RoomStats;
  serviceStats: ServiceStats;
  userStats: UserStats | null;
  eventStats: EventStats | null;
  revenueData: Revenue[];
  revenueStats?: RevenueStats | null;
  dateFilter: DateFilter;
  onFilterChange: (filter: DateFilter) => void;
  onRefresh: () => void;
};

export default function AdminDashboard({
  roomStats,
  serviceStats,
  userStats,
  eventStats,
  revenueData,
  revenueStats,
  dateFilter,
  onFilterChange,
  onRefresh,
}: AdminDashboardProps) {
  const metrics = [
    {
      title: 'Tổng số phòng',
      value: roomStats.totalRooms || 0,
      description: 'Tổng số phòng trong kho',
      icon: <FaDoorOpen size={24} />,
      color: 'bg-yellow-400 text-yellow-900',
    },
    {
      title: 'Tổng số dịch vụ',
      value: serviceStats.totalServices || 0,
      description: 'Tổng số dịch vụ đã cung cấp',
      icon: <FaConciergeBell size={24} />,
      color: 'bg-amber-600 text-amber-100',
    },
    {
      title: 'Tổng số người dùng',
      value: userStats?.totalUsers || 0,
      description: 'Người dùng đã đăng ký',
      icon: <FaUsers size={24} />,
      color: 'bg-indigo-500 text-indigo-100',
    },
    {
      title: 'Tổng số sự kiện',
      value: eventStats?.total || 0,
      description: 'Sự kiện đã được đặt cho đến nay',
      icon: <FaCalendarAlt size={24} />,
      color: 'bg-green-500 text-green-100',
    },
  ];

  console.log(revenueData);
  console.log(revenueStats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-3">
            CHÀO MỪNG ĐẾN VỚI DASHBOARD!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Xem tổng quan về hoạt động kinh doanh, dịch vụ được đặt nhiều nhất,
            và các thống kê khác để đưa ra quyết định tốt hơn.
          </p>
        </div>

        {/* Filter Component */}
        <DashboardFilter
          currentFilter={dateFilter}
          onFilterChange={onFilterChange}
          onRefresh={onRefresh}
        />

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-current transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-current transform -translate-x-10 translate-y-10"></div>
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${metric.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-2xl">{metric.icon}</div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {metric.title}
                </h3>

                {/* Value */}
                <div className="text-4xl font-black text-gray-900 mb-4 group-hover:scale-105 transition-transform duration-300">
                  {metric.value.toLocaleString()}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metric.description}
                </p>

                {/* Progress Indicator */}
                <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${Math.min((metric.value / 100) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl p-8 text-white group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FaChartLine className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm font-medium">Tháng này</p>
                <p className="text-xs text-blue-200 flex items-center gap-1">
                  <FaArrowUp className="w-3 h-3" />
                  +12.5%
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-blue-100">
              Tổng doanh thu
            </h3>
            <p className="text-3xl font-black">
              {revenueStats
                ? `${revenueStats.totalRevenue.toLocaleString()} đ`
                : '0 đ'}
            </p>
          </div>

          {/* Highest Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-xl p-8 text-white group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FaArrowUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm font-medium">
                  {revenueStats?.currentMonth || 'Tháng 8'}
                </p>
                <p className="text-xs text-green-200">Cao nhất</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-100">
              Doanh thu cao nhất
            </h3>
            <p className="text-3xl font-black">
              {revenueStats
                ? `${revenueStats.highestRevenue.toLocaleString()} đ`
                : '492K đ'}
            </p>
          </div>

          {/* Lowest Revenue */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-xl p-8 text-white group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FaArrowDown className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-sm font-medium">
                  {revenueStats?.previousMonth || 'Tháng 7'}
                </p>
                <p className="text-xs text-orange-200">Thấp nhất</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-orange-100">
              Doanh thu thấp nhất
            </h3>
            <p className="text-3xl font-black">
              {revenueStats
                ? `${revenueStats.lowestRevenue.toLocaleString()} đ`
                : '144K đ'}
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Tổng doanh thu
              </h3>
              <p className="text-gray-600">Biểu đồ doanh thu theo thời gian</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">
                  Doanh thu
                </span>
              </div>
            </div>
          </div>

          <div className="h-96 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: '500' }}
                  tickFormatter={(date) => {
                    console.log(date);

                    return dateFilter.period === 'year'
                      ? `Tháng ${date}`
                      : new Date(date).toLocaleDateString('vi-VN', {
                          month: 'short',
                          day: 'numeric',
                        });
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  // dataKey={'revenue'}
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: '500' }}
                  tickFormatter={(value) => `${value.toLocaleString()} đ`}
                  axisLine={false}
                  tickLine={false}
                  domain={[
                    0,
                    Math.max(...revenueData.map((item) => item.revenue), 0) +
                      50000,
                  ]}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow:
                      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                    fontWeight: '600',
                    padding: '16px',
                  }}
                  labelFormatter={(label) =>
                    dateFilter.period === 'year'
                      ? `Tháng ${label}`
                      : new Date(label).toLocaleDateString('vi-VN', {
                          month: 'short',
                          day: 'numeric',
                        })
                  }
                  formatter={(value: number) => [
                    `${value.toLocaleString('vi-VN')} đ`,
                    'Doanh thu',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#colorGradient)"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    strokeWidth: 3,
                    fill: '#ffffff',
                    stroke: '#f97316',
                  }}
                  activeDot={{
                    r: 8,
                    strokeWidth: 3,
                    fill: '#f97316',
                    stroke: '#ffffff',
                  }}
                  animationDuration={2000}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
