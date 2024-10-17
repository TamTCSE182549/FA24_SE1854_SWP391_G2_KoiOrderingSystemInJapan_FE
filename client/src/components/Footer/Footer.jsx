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
    <footer>
      <div className="bg-gradient-to-t from-green-600 to-green-900 shadow-lg text-wh300 py-10 mt-10">
        <div className="container mx-auto px-4">
          <Row gutter={[16, 16]}>
            {/* Logo và Mạng Xã Hội */}
            <Col xs={24} md={8}>
              <div className="text-3xl font-bold mb-4">TNW</div>
              <p className="text-gray-300">The heart of tech</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="text-gray-300 hover:text-white"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-gray-300 hover:text-white"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="text-gray-300 hover:text-white"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-gray-300 hover:text-white"
                >
                  <FaYoutube />
                </a>
                <a
                  href="#"
                  aria-label="Email"
                  className="text-gray-300 hover:text-white"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-gray-300 hover:text-white"
                >
                  <FaLinkedin />
                </a>
              </div>
            </Col>

            {/* MORE TNW */}
            <Col xs={12} md={8}>
              <h4 className="font-semibold mb-4 text-gray-300">MORE TNW</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Media
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Programs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Spaces
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Newsletters
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Deals
                  </a>
                </li>
              </ul>
            </Col>

            {/* ABOUT TNW */}
            <Col xs={12} md={8}>
              <h4 className="font-semibold mb-4 text-gray-300">ABOUT TNW</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Partner with us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Cookie Statement
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Privacy Statement
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Editorial Policy
                  </a>
                </li>
              </ul>
            </Col>
          </Row>

          {/* Copyright */}
          <div className="mt-10 border-t border-gray-500 pt-6 text-center text-gray-300">
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
      </div>
    </footer>
  );
};

export default Footer;
