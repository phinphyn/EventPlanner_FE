import Footer from '@/components/client/common/Footer';
import Header from '@/components/client/common/Header';
import React, { type PropsWithChildren } from 'react';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

const CustomerLayout: React.FC<PropsWithChildren> = ({ children }) => {
  React.useEffect(() => {
    createChat({
      webhookUrl:
        'http://localhost:5678/webhook/dea60903-b397-40de-982c-4df4a96181e9/chat',
      target: '#n8n-chat',
      mode: 'window',
      initialMessages: [
        'Xin chào! 👋',
        'Tên tôi là Planner. Tôi có thể giúp gì cho bạn hôm nay?',
      ],
      i18n: {
        en: {
          title: 'Xin chào! 👋',
          subtitle: 'Chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.',
          footer: '',
          getStarted: 'Cuộc trò chuyện mới',
          inputPlaceholder: 'Bạn cần gì...',
        },
      },
    });
  }, []);

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen bg-gray-100 pb-24">
        {children}
        <div id="n8n-chat"></div>
      </main>
      <Footer />
    </>
  );
};

export default CustomerLayout;
