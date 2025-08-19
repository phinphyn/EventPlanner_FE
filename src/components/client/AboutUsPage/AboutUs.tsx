import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Về Chúng Tôi</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Chào mừng bạn đến với công ty của chúng tôi! Chúng tôi cam kết mang đến dịch vụ tốt nhất cho khách hàng.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <section className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Cung cấp các giải pháp chất lượng cao và vượt qua mong đợi của khách hàng.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chúng tôi là những chuyên gia đầy đam mê và tận tâm với sự xuất sắc.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
              Liên Hệ
            </h2>
            <div className="text-lg text-gray-600">
              <p className="mb-2">Hãy liên hệ với chúng tôi để được hỗ trợ tốt nhất:</p>
              <p className="flex items-center">
                <span className="font-medium text-gray-800">Email:</span>
                <span className="ml-2 text-blue-600 hover:text-blue-800 transition-colors">
                  info@company.com
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
