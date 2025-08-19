import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.data?.token) {
        setError(data?.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }
      // Save token
      authService.setAccessToken(data.data.token);
      // Optionally save user info
      localStorage.setItem('user', JSON.stringify(data.data));
      console.log(data.data);

      if (data.data.role === 'ADMIN' || data.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.data.role === 'STAFF' || data.data.role === 'staff') {
        navigate('/employee/dashboard');
      } else if (
        data.data.role === 'CUSTOMER' ||
        data.data.role === 'customer'
      ) {
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      toast.error('Lỗi kết nối máy chủ');
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl"></div>

        {/* Main Card */}
        <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Chào mừng trở lại
            </h2>
            <p className="text-white/80 text-sm">
              Đăng nhập để tiếp tục sử dụng dịch vụ
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-destructive flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-destructive text-sm font-medium">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder-muted-foreground"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder-muted-foreground"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50 focus:ring-2"
                  />
                  <span className="text-sm text-muted-foreground">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 rounded-lg font-semibold hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Đăng nhập</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground bg-card">
                hoặc
              </span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-10 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
      <div className="fixed top-20 right-20 w-3 h-3 bg-secondary/30 rounded-full animate-pulse delay-1000"></div>
      <div className="fixed bottom-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse delay-500"></div>
      <div className="fixed bottom-10 right-10 w-3 h-3 bg-secondary/30 rounded-full animate-pulse delay-1500"></div>
    </div>
  );
};

export default LoginPage;
