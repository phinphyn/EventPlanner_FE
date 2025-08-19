import React from 'react';

interface PaymentStepProps {
  amount?: number;
  //   onPaymentSuccess: () => void;
  //   onPaymentFailure: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ amount }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary text-center">
        Thanh toán ngay và hoàn tất lịch hẹn cho sự kiện của bạn! {amount}
      </h1>
    </div>
  );
};

export default PaymentStep;
