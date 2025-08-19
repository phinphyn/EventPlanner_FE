import type React from 'react';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Home,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type PaymentStatus =
  | 'success'
  | 'failed'
  | 'pending'
  | 'canceled'
  | 'processing';

interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const statusConfigs: Record<PaymentStatus, StatusConfig> = {
  success: {
    icon: CheckCircle,
    title: 'Thanh toán thành công!',
    description:
      'Giao dịch của bạn đã được xử lý thành công. Bạn sẽ nhận được email xác nhận trong vài phút.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  failed: {
    icon: XCircle,
    title: 'Thanh toán thất bại',
    description:
      'Rất tiếc, giao dịch của bạn không thể được xử lý. Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  pending: {
    icon: Clock,
    title: 'Đang xử lý thanh toán',
    description:
      'Giao dịch của bạn đang được xử lý. Chúng tôi sẽ thông báo kết quả trong thời gian sớm nhất.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  canceled: {
    icon: AlertTriangle,
    title: 'Thanh toán đã bị hủy',
    description:
      'Bạn đã hủy giao dịch. Nếu đây là nhầm lẫn, bạn có thể thử thanh toán lại.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  processing: {
    icon: Clock,
    title: 'Đang xử lý...',
    description:
      'Giao dịch của bạn đang được xử lý. Vui lòng không đóng trang này.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
};

const PaymentStatusPage = () => {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchParams(urlParams);
  }, []);

  const status = (searchParams?.get('status') as PaymentStatus) || 'processing';
  const sessionId = searchParams?.get('session_id');
  const amount = searchParams?.get('amount');
  const currency = searchParams?.get('currency') || 'VND';

  const config = statusConfigs[status] || statusConfigs.processing;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowContent(true), 100);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-redirect countdown for successful payment
  useEffect(() => {
    if (status === 'success' && showContent) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Redirect to home page
            window.location.href = '/';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [status, showContent]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const copySessionId = async () => {
    if (sessionId) {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return null;
    const numAmount = Number.parseInt(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400 opacity-20 mx-auto"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-700">
                Đang xử lý kết quả
              </p>
              <p className="text-sm text-slate-500">
                Vui lòng chờ trong giây lát...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-2xl space-y-8 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Card
          className={`${config.borderColor} border-2 shadow-2xl backdrop-blur-sm bg-white/90 transform transition-all duration-500 hover:scale-[1.02]`}
        >
          <CardContent className="p-10">
            <div className="text-center space-y-8">
              <div className="relative">
                <div
                  className={`${
                    config.bgColor
                  } rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg transform transition-all duration-500 ${
                    showContent ? 'scale-100' : 'scale-0'
                  }`}
                >
                  <Icon
                    className={`w-12 h-12 ${config.color} drop-shadow-sm`}
                  />
                </div>
                {status === 'success' && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20"></div>
                )}
              </div>

              <div className="space-y-4">
                <h1
                  className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent transition-all duration-700 ${
                    showContent
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  {config.title}
                </h1>
                <p
                  className={`text-slate-600 text-lg leading-relaxed max-w-lg mx-auto transition-all duration-700 delay-100 ${
                    showContent
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  {config.description}
                </p>

                {/* Auto-redirect countdown for success */}
                {status === 'success' && showContent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-700 text-sm font-medium">
                      Tự động chuyển về trang chủ trong{' '}
                      <span className="font-bold text-green-800">
                        {countdown}
                      </span>{' '}
                      giây
                    </p>
                  </div>
                )}
              </div>

              {amount && (
                <div
                  className={`bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 inline-block shadow-inner border transition-all duration-700 delay-200 ${
                    showContent
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    Số tiền thanh toán
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {formatAmount(amount)}
                  </p>
                </div>
              )}

              <Badge
                variant={status === 'success' ? 'default' : 'secondary'}
                className={`${config.color} ${
                  config.bgColor
                } border-current px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-700 delay-300 ${
                  showContent
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
              >
                {status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {sessionId && (
          <Card
            className={`shadow-xl backdrop-blur-sm bg-white/90 transition-all duration-700 delay-400 ${
              showContent
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <CardContent className="p-8">
              <h3 className="font-bold text-xl mb-6 text-slate-800">
                Chi tiết giao dịch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border shadow-sm">
                  <span className="text-sm font-medium text-slate-600">
                    Mã giao dịch
                  </span>
                  <div className="flex items-center gap-3">
                    <code className="text-sm font-mono bg-white px-3 py-2 rounded-lg border shadow-sm text-slate-700">
                      {sessionId.slice(0, 20)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copySessionId}
                      className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-slate-600" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border shadow-sm">
                  <span className="text-sm font-medium text-slate-600">
                    Thời gian
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${
            showContent
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          {status === 'success' && (
            <>
              <Button
                onClick={handleGoHome}
                size="lg"
                className="flex text-white items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary hover:text-tertiary shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
              >
                <Home className="w-5 h-5" />
                Về trang chủ ({countdown}s)
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-slate-50 transition-all duration-300 px-8 py-3 bg-transparent"
              >
                Xem lịch hẹn
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <Button
                size="lg"
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
              >
                <RefreshCw className="w-5 h-5" />
                Thử lại thanh toán
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-slate-50 transition-all duration-300 px-8 py-3 bg-transparent"
              >
                Liên hệ hỗ trợ
              </Button>
            </>
          )}

          {status === 'canceled' && (
            <Button
              size="lg"
              className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
            >
              <ArrowRight className="w-5 h-5" />
              Quay lại thanh toán
            </Button>
          )}

          {(status === 'pending' || status === 'processing') && (
            <Button
              variant="outline"
              size="lg"
              className="border-2 hover:bg-slate-50 transition-all duration-300 px-8 py-3 bg-transparent"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Kiểm tra lại
            </Button>
          )}
        </div>

        <div
          className={`text-center transition-all duration-700 delay-600 ${
            showContent
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-sm text-slate-500">
            Cần hỗ trợ?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Liên hệ với chúng tôi
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
