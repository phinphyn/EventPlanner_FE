import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { IoWarningOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '@/services/userService';

const ChangePasswordTab: React.FC = () => {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu không được để trống';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (!passwordValidation.isValid) {
      newErrors.newPassword = 'Mật khẩu mới không hợp lệ';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác với mật khẩu hiện tại';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await userService.updatePassword(
          formData.currentPassword,
          formData.newPassword,
        );

        if (response.statusCode !== 200) {
          throw new Error(response.message || 'Failed to update password');
        }

        toast.success(
          'Mật khẩu đã được cập nhật thành công! Vui lòng đăng nhập lại.',
        );

        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
      } catch (error) {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message : 'An error occurred',
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    navigate('/login');
  }, [navigate]);

  const PasswordRequirement = ({
    met,
    text,
  }: {
    met: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center gap-2 text-sm ${
        met ? 'text-green-600' : 'text-slate-500'
      }`}
    >
      {met ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {text}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Lock className="h-6 w-6" />
          Đổi mật khẩu
        </h2>
        <p className="text-slate-600 mt-1">Cập nhật mật khẩu của bạn</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-600" />
              Cập nhật mật khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleInputChange('currentPassword', e.target.value)
                    }
                    className={errors.currentPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange('newPassword', e.target.value)
                    }
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Yêu cầu mật khẩu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PasswordRequirement
              met={passwordValidation.minLength}
              text="Ít nhất 8 ký tự"
            />
            <PasswordRequirement
              met={passwordValidation.hasUpperCase}
              text="Ít nhất 1 ký tự viết hoa"
            />
            <PasswordRequirement
              met={passwordValidation.hasLowerCase}
              text="Ít nhất 1 ký tự viết thường"
            />
            <PasswordRequirement
              met={passwordValidation.hasNumbers}
              text="Ít nhất 1 ký tự số"
            />
            <PasswordRequirement
              met={passwordValidation.hasSpecialChar}
              text="Ít nhất 1 ký tự đặc biệt"
            />

            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Chọn một mật khẩu mạnh mà bạn chưa sử dụng ở nơi khác. Xem xét
                việc sử dụng trình quản lý mật khẩu.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <hr className="my-8" />
      <div className="flex justify-center items-center">
        <Button
          variant={'default'}
          onClick={handleLogout}
          className="text-center py-6 px-16 w-1/2 text-white bg-red-500 hover:bg-red-600"
        >
          <IoWarningOutline /> Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default ChangePasswordTab;
