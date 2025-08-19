import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, History, Lock } from 'lucide-react';

const ProfilePageContainer: React.FC = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/booking-history')) return 'booking-history';
    if (path.includes('/change-password')) return 'change-password';
    return 'profile';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Thông tin tài khoản
          </h1>
          <p className="text-slate-600">
            Quản lý thông tin cá nhân và tùy chọn tài khoản
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={getActiveTab()} className="w-full">
              <div className="border-b border-slate-200 px-6 pt-6 pb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-100">
                  <TabsTrigger value="profile" asChild>
                    <Link to="/profile/me" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Thông tin cá nhân
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="booking-history" asChild>
                    <Link
                      to="/profile/booking-history"
                      className="flex items-center gap-2"
                    >
                      <History className="h-4 w-4" />
                      Lịch sử đặt lịch
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="change-password" asChild>
                    <Link
                      to="/profile/change-password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Bảo mật
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <Outlet />
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePageContainer;
