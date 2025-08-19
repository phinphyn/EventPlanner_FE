import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-tertiary text-white'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <Link to={'/'} className='flex items-center'>
              <img src='/logo.png' alt='Logo' className='h-12' />
            </Link>
            <p className='text-gray-300 leading-relaxed'>
              Nền tảng tổ chức sự kiện hàng đầu Việt Nam. Chúng tôi giúp bạn tạo
              ra những trải nghiệm đáng nhớ và kết nối cộng đồng.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                <Facebook size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                <Instagram size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                <Twitter size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-primary'>
              Liên kết nhanh
            </h3>
            <nav className='flex flex-col space-y-3'>
              <Link
                to={'/'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Trang chủ
              </Link>
              <Link
                to={'/about-us'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Giới thiệu
              </Link>
              <Link
                to={'/event'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Sự kiện
              </Link>
              <Link
                to={'/contact'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Liên hệ
              </Link>
              <Link
                to={'/pricing'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Bảng giá
              </Link>
              <Link
                to={'/support'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Hỗ trợ
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-primary'>Dịch vụ</h3>
            <nav className='flex flex-col space-y-3'>
              <Link
                to={'/event-planning'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Lập kế hoạch sự kiện
              </Link>
              <Link
                to={'/venue-booking'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Đặt địa điểm
              </Link>
              <Link
                to={'/catering'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Dịch vụ ăn uống
              </Link>
              <Link
                to={'/decoration'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Trang trí
              </Link>
              <Link
                to={'/photography'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Chụp ảnh & quay phim
              </Link>
              <Link
                to={'/live-streaming'}
                className='text-gray-300 hover:text-primary transition-colors duration-300'
              >
                Live streaming
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-primary'>
              Thông tin liên hệ
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <MapPin size={20} className='text-primary flex-shrink-0' />
                <span className='text-gray-300'>
                  123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone size={20} className='text-primary flex-shrink-0' />
                <span className='text-gray-300'>+84 123 456 789</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail size={20} className='text-primary flex-shrink-0' />
                <span className='text-gray-300'>info@eventplatform.vn</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className='mt-6'>
              <h4 className='text-lg font-medium text-primary mb-3'>
                Đăng ký nhận tin
              </h4>
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type='email'
                  placeholder='Email của bạn'
                  className='flex-1 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none'
                />
                <Button className='bg-primary text-tertiary px-6 py-2 rounded hover:bg-secondary transition-colors duration-300 font-medium'>
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-700'>
        <div className='container mx-auto px-6 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} Event Platform. Tất cả quyền được bảo
              lưu.
            </div>
            <div className='flex flex-wrap justify-center md:justify-end space-x-6 text-sm'>
              <Link
                to={'/privacy'}
                className='text-gray-400 hover:text-primary transition-colors duration-300'
              >
                Chính sách bảo mật
              </Link>
              <Link
                to={'/terms'}
                className='text-gray-400 hover:text-primary transition-colors duration-300'
              >
                Điều khoản sử dụng
              </Link>
              <Link
                to={'/cookies'}
                className='text-gray-400 hover:text-primary transition-colors duration-300'
              >
                Chính sách Cookie
              </Link>
              <Link
                to={'/sitemap'}
                className='text-gray-400 hover:text-primary transition-colors duration-300'
              >
                Sơ đồ trang web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
