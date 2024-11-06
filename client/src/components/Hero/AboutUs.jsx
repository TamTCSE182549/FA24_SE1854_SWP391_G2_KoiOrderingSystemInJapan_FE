import React, { useState } from 'react';

const AboutUs = () => {
  const [language, setLanguage] = useState('en'); // Default language is English

  const content = {
    en: {
      title: "About Us",
      mission: {
        title: "Our Mission",
        description: "We are committed to providing customers with a professional, unique, and reliable Koi fish shopping experience, directly connecting Vietnamese aquarium enthusiasts with renowned Koi farms in Japan."
      },
      services: [
        {
          title: "Specialized Farm Tours",
          description: "Organizing direct visits to famous Koi farms in Japan"
        },
        {
          title: "Expert Consultation",
          description: "Experienced team of specialists supporting the selection of suitable Koi varieties"
        },
        {
          title: "All-Inclusive Service",
          description: "From consultation, tour booking, purchase support to transportation and delivery"
        },
        {
          title: "Quality Assurance",
          description: "Guaranteed origin and quality of Koi fish from reputable farms"
        }
      ],
      commitments: {
        title: "Our Commitments",
        items: [
          "Transparency in pricing and services",
          "Customer rights protection",
          "24/7 Support",
          "Clear warranty and refund policy"
        ]
      },
      contact: {
        title: "Contact Us",
        phone: "Hotline: 0123.456.789",
        email: "Email: contact@koiservice.com",
        address: "Address: 123 ABC Street, XYZ District, HCMC"
      }
    },
    vi: {
      title: "Về Chúng Tôi",
      mission: {
        title: "Sứ Mệnh",
        description: "Chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua sắm cá Koi chuyên nghiệp, độc đáo và đáng tin cậy, kết nối trực tiếp người yêu cá cảnh Việt Nam với những trang trại Koi danh tiếng tại Nhật Bản."
      },
      services: [
        {
          title: "Tour Tham Quan Chuyên Biệt",
          description: "Tổ chức các chuyến thăm quan trực tiếp đến các trang trại cá Koi nổi tiếng tại Nhật Bản"
        },
        {
          title: "Tư Vấn Chuyên Sâu",
          description: "Đội ngũ chuyên gia giàu kinh nghiệm hỗ trợ lựa chọn giống cá phù hợp với nhu cầu"
        },
        {
          title: "Dịch Vụ Trọn Gói",
          description: "Từ tư vấn, đặt tour, hỗ trợ mua cá đến vận chuyển và bàn giao tận nơi"
        },
        {
          title: "Bảo Đảm Chất Lượng",
          description: "Cam kết nguồn gốc và chất lượng cá Koi từ các trang trại uy tín"
        }
      ],
      commitments: {
        title: "Cam Kết Của Chúng Tôi",
        items: [
          "Minh bạch trong giá cả và dịch vụ",
          "Đảm bảo quyền lợi khách hàng",
          "Hỗ trợ 24/7",
          "Chính sách bảo hành và hoàn tiền rõ ràng"
        ]
      },
      contact: {
        title: "Liên Hệ Với Chúng Tôi",
        phone: "Hotline: 0123.456.789",
        email: "Email: contact@koiservice.com",
        address: "Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Language Switcher */}
        <div className="flex justify-end mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                language === 'en'
                  ? 'bg-blue-500 text-black'
                  : 'hover:bg-gray-100 text-black'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('vi')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                language === 'vi'
                  ? 'bg-blue-500 text-black'
                  : 'hover:bg-gray-100 text-black'
              }`}
            >
              Tiếng Việt
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {currentContent.title}
          </h1>
          <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Mission Statement */}
        <div className="max-w-3xl mx-auto mb-16 animate-slideUp">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            {currentContent.mission.title}
          </h2>
          <p className="text-center text-gray-600 leading-relaxed">
            {currentContent.mission.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {currentContent.services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Commitments Section */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white p-8 rounded-lg shadow-md max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {currentContent.commitments.title}
          </h2>
          <ul className="space-y-4">
            {currentContent.commitments.items.map((commitment, index) => (
              <li key={index} className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                <svg 
                  className="w-5 h-5 text-green-500 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{commitment}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {currentContent.contact.title}
          </h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p>{currentContent.contact.phone}</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>{currentContent.contact.email}</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>{currentContent.contact.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;