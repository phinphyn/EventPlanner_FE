import React, { useEffect, useState } from 'react';
import AdminDashboard, {
  type RoomStats,
  type ServiceStats,
  // type InvoiceStats,
  // type RevenueData,
  type UserStats,
  type EventStats,
} from '../admin/components/AdminDashboard';
import RoomService from '../../services/roomService';
import ServiceService from '../../services/serviceService';
import AccountService from '../../services/accountService';
import EventService from '../../services/eventService';
import revenueService, { type Revenue } from '@/services/revenueService';

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

export default function DashboardPage() {
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [revenueData, setRevenueData] = useState<Revenue[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    period: 'year',
    year: new Date().getFullYear(),
  });

  const calculateRevenueStats = (filter: DateFilter) => {
    const { period, year, month } = filter;
    const data = [];
    let totalRevenue = 0;
    let highestRevenue = 0;
    let lowestRevenue = Number.MAX_VALUE;

    if (period === 'month' && month) {
      // Generate daily data for specific month
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= Math.min(daysInMonth, 30); day++) {
        const amount = Math.floor(Math.random() * 200000) + 100000; // 100k - 300k
        data.push({
          date: `${year}-${month.toString().padStart(2, '0')}-${day
            .toString()
            .padStart(2, '0')}`,
          amount,
          label: `Ngày ${day}`,
        });
        totalRevenue += amount;
        highestRevenue = Math.max(highestRevenue, amount);
        lowestRevenue = Math.min(lowestRevenue, amount);
      }
    } else {
      // Generate monthly data for entire year
      const monthNames = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ];

      for (let m = 1; m <= 12; m++) {
        const amount = Math.floor(Math.random() * 400000) + 100000; // 100k - 500k
        data.push({
          date: `${year}-${m.toString().padStart(2, '0')}-01`,
          amount,
          label: monthNames[m - 1],
        });
        totalRevenue += amount;
        highestRevenue = Math.max(highestRevenue, amount);
        lowestRevenue = Math.min(lowestRevenue, amount);
      }
    }

    // Set revenue stats
    const currentMonth = new Date().toLocaleDateString('vi-VN', {
      month: 'long',
    });
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 1),
    ).toLocaleDateString('vi-VN', { month: 'long' });

    return {
      totalRevenue,
      highestRevenue,
      lowestRevenue,
      currentMonth,
      previousMonth,
    };
  };

  console.log(dateFilter);

  const fetchData = React.useCallback(async (filter: DateFilter) => {
    try {
      // Generate revenue data based on filter
      const revenueStat = calculateRevenueStats(filter);

      const revenueRes = await revenueService.getRevenue(filter);

      if (revenueRes.statusCode === 403) {
        alert('Bạn không có quyền truy cập vào trang này');
        window.location.href = '/';
        return;
      }

      const roomres = await RoomService.getAllRooms();
      const serviceres = await ServiceService.getAllServices();
      const accountres = await AccountService.getAllAccounts();
      const eventres = await EventService.getAllEvents();

      setRoomStats({ totalRooms: roomres.data.length || 0 });
      setServiceStats({
        totalServices: serviceres.data.services.length || 0,
      });
      setUserStats({ totalUsers: accountres.data.accounts.length || 0 });
      setEventStats({ total: eventres.data.length || 0 });

      setRevenueData(revenueRes.data);
      setRevenueStats(revenueStat);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  const handleFilterChange = (newFilter: DateFilter) => {
    setDateFilter(newFilter);
    fetchData(newFilter);
  };

  const handleRefresh = () => {
    fetchData(dateFilter);
  };

  useEffect(() => {
    fetchData(dateFilter);
  }, [dateFilter, fetchData]);

  if (!roomStats || !serviceStats) {
    return <div className="p-6 text-lg">Loading dashboard...</div>;
  }

  return (
    <AdminDashboard
      roomStats={roomStats}
      serviceStats={serviceStats}
      userStats={userStats}
      eventStats={eventStats}
      revenueData={revenueData}
      revenueStats={revenueStats}
      dateFilter={dateFilter}
      onFilterChange={handleFilterChange}
      onRefresh={handleRefresh}
    />
  );
}
