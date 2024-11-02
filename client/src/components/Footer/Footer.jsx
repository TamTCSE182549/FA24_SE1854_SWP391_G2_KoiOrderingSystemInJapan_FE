import React from "react";
import { Row, Col } from "antd";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} md={8}>
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                TNW
              </h2>
              <p className="text-gray-600 mb-6">
                Khám phá tin tức công nghệ mới nhất và xu hướng kỹ thuật số với TNW - 
                nơi công nghệ gặp gỡ tương lai.
              </p>
              <div className="flex items-center space-x-2 text-gray-600 mb-3">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>123 Tech Street, Amsterdam, Netherlands</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaPhone className="text-blue-500" />
                <span>+31 (0) 20 123 4567</span>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={24} md={8}>
            <h3 className="text-xl font-semibold mb-6 text-blue-500">Khám Phá</h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Tin Tức
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Sự Kiện
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Đánh Giá
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Podcast
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Về Chúng Tôi
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Tuyển Dụng
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      Liên Hệ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>

          {/* Newsletter */}
          <Col xs={24} md={8}>
            <h3 className="text-xl font-semibold mb-6 text-blue-500">Đăng Ký Nhận Tin</h3>
            <p className="text-gray-600 mb-4">
              Nhận những tin tức công nghệ mới nhất trực tiếp vào hộp thư của bạn
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Đăng Ký
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-500 transition-colors group"
                >
                  <Icon className="text-gray-600 group-hover:text-white" />
                </a>
              ))}
            </div>
          </Col>
        </Row>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            TNW là thành viên của <span className="text-blue-500">Financial Times</span>
          </p>
          <p className="text-gray-600 mt-2">
            © {new Date().getFullYear()} TNW - The Next Web B.V. 
            Được tạo với <span className="text-red-500">♥</span> tại Amsterdam.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
