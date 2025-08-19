import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, Edit3, UserCheck } from 'lucide-react';
import type { UserInfoType } from '@/services/userService';

const PersonalInfoTab = () => {
  const userInfo: UserInfoType = JSON.parse(
    localStorage.getItem('user') || 'null',
  );

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-8">
            <User className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Profile Data
            </h3>
            <p className="text-slate-600 text-center">
              Unable to load profile information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGenderBadgeColor = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'female':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-slate-100">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={userInfo.avatar_url || '/placeholder.svg'}
                alt={userInfo.account_name}
              />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                {getInitials(userInfo.account_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 truncate">
                  {userInfo.account_name}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Hoạt động
                </Badge>
              </div>

              <p className="text-slate-600 mb-4">
                ID Tài khoản: #{userInfo.account_id}
              </p>

              <div className="flex flex-wrap gap-2">
                {userInfo.gender && (
                  <Badge className={getGenderBadgeColor(userInfo.gender)}>
                    {userInfo.gender}
                  </Badge>
                )}
                <Badge variant="outline">
                  {userInfo.role || 'Not specified'}
                </Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" className="shrink-0">
              <Edit3 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-slate-600" />
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <p className="text-slate-900 font-medium">
                  {userInfo.email || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Điện thoại
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <p className="text-slate-900 font-medium">
                  {userInfo.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-600" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ngày sinh
            </label>
            <div className="p-3 bg-slate-50 rounded-lg border">
              <p className="text-slate-900 font-medium">
                {formatDate(userInfo.dateOfBirth)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
