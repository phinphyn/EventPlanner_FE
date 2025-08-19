export const formatPrice = (price: string | null) => {
  if (!price) return 'Chưa xác định';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number.parseInt(price));
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
