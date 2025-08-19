import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/accounts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password_hash: password,
          account_name: accountName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.data) {
        setError(data?.message || 'Đăng ký thất bại');
        setLoading(false);
        return;
      }
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>

      {/* Register Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl"></div>

        {/* Main Card */}
        <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              {/* You can add a logo or icon here */}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Đăng ký tài khoản
            </h2>
            <p className="text-white/80 text-sm">
              Tạo tài khoản mới để sử dụng hệ thống
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  placeholder="Nhập tên tài khoản"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-secondary transition"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
              <div className="text-center text-sm mt-2">
                Đã có tài khoản?{' '}
                <span
                  className="text-primary cursor-pointer hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </span>
              </div>
            </form>
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

export default RegisterPage;
