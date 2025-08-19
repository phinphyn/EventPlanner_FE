import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { UserInfoType } from '@/services/userService';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile/me');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      // You can also get user info from localStorage or decode from token
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUserInfo(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  return (
    <header className="bg-gray-300 text-white py-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={'/'} className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </Link>

        {/* Navbar */}
        <nav className="flex space-x-8">
          <Link
            to={'/'}
            className="text-tertiary font-semibold hover:text-primary"
          >
            Trang chủ
          </Link>
          <Link
            to={'/about-us'}
            className="text-tertiary font-semibold hover:text-primary"
          >
            Giới thiệu
          </Link>
          <Link
            to={'/services'}
            className="text-tertiary font-semibold hover:text-primary"
          >
            Dịch vụ
          </Link>
          <Link
            to={'/rooms'}
            className="text-tertiary font-semibold hover:text-primary"
          >
            Phòng tiệc
          </Link>
          <Link
            to={'/contact'}
            className="text-tertiary font-semibold hover:text-primary"
          >
            Liên hệ
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex space-x-4 items-center">
          <Button
            onClick={() => navigate('/bookings')}
            className="bg-primary-foreground text-primary px-4 py-2 rounded hover:bg-primary hover:text-primary-foreground"
          >
            Tạo sự kiện
          </Button>

          {!isLoggedIn ? (
            <Button
              onClick={() => navigate('/login')}
              color="primary"
              className="bg-primary text-secondary px-4 py-2 rounded hover:bg-secondary hover:text-primary"
            >
              Đăng nhập
            </Button>
          ) : (
            <div className="flex items-center space-x-2 cursor-pointer">
              {/* User Avatar */}
              <button
                onClick={handleAvatarClick}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden"
              >
                {userInfo?.avatar_url ? (
                  <img
                    src={userInfo.avatar_url}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {userInfo?.account_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
