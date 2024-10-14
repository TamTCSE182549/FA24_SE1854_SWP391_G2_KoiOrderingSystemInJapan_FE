import React from "react";
import { Row, Col } from "antd";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#c5bd92] text-gray-900 py-10">
      <div className="container mx-auto px-4">
        <Row gutter={[16, 16]}>
          {/* Logo và Mạng Xã Hội */}
          <Col xs={24} md={8}>
            <div className="text-3xl font-bold mb-4">TNW</div>
            <p className="text-gray-800">The heart of tech</p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-800 hover:text-gray-600"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-800 hover:text-gray-600"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-800 hover:text-gray-600"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-800 hover:text-gray-600"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                aria-label="Email"
                className="text-gray-800 hover:text-gray-600"
              >
                <FaEnvelope />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-800 hover:text-gray-600"
              >
                <FaLinkedin />
              </a>
            </div>
          </Col>

          {/* MORE TNW */}
          <Col xs={12} md={8}>
            <h4 className="font-semibold mb-4 text-gray-800">MORE TNW</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Media
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Programs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Spaces
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Newsletters
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Deals
                </a>
              </li>
            </ul>
          </Col>

          {/* ABOUT TNW */}
          <Col xs={12} md={8}>
            <h4 className="font-semibold mb-4 text-gray-800">ABOUT TNW</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Partner with us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Cookie Statement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Privacy Statement
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-800 hover:text-gray-600">
                  Editorial Policy
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-500 pt-6 text-center text-gray-800">
          <p>
            TNW is a <span className="font-semibold">Financial Times</span>{" "}
            company.
          </p>
          <p>
            Copyright © 2006—2024, The Next Web B.V. Made with{" "}
            <span className="text-red-500">♥</span> in Amsterdam.
          </p>
        </div>
      </div>
    </footer>
  );
};

// const PageLayout = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Nội dung chính */}
//       <div className="flex-grow">
//         {children} {/* Đây là nơi đặt nội dung chính */}
//       </div>
//       {/* Footer luôn nằm cuối trang */}
//       <Footer />
//     </div>
//   );
// };

export default Footer;
