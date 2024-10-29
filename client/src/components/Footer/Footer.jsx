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
    <footer className="backdrop-filter backdrop-blur-3xl mt-20">
      <div className="shadow-lg text-black py-9 bg-white">
        <div className="container mx-auto px-4">
          <Row gutter={[16, 16]}>
            {/* Logo và Mạng Xã Hội */}
            <Col xs={24} md={8}>
              <div className="text-3xl font-bold mb-4 text-black">TNW</div>
              <p className="text-black">The heart of tech</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="text-black hover:text-gray-700"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-black hover:text-gray-700"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="text-black hover:text-gray-700"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-black hover:text-gray-700"
                >
                  <FaYoutube />
                </a>
                <a
                  href="#"
                  aria-label="Email"
                  className="text-black hover:text-gray-700"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-black hover:text-gray-700"
                >
                  <FaLinkedin />
                </a>
              </div>
            </Col>

            {/* MORE TNW */}
            <Col xs={12} md={8}>
              <h4 className="font-semibold mb-4 text-black">MORE TNW</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Media
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Programs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Spaces
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Newsletters
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Deals
                  </a>
                </li>
              </ul>
            </Col>

            {/* ABOUT TNW */}
            <Col xs={12} md={8}>
              <h4 className="font-semibold mb-4 text-black">ABOUT TNW</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Partner with us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Cookie Statement
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Privacy Statement
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-gray-700">
                    Editorial Policy
                  </a>
                </li>
              </ul>
            </Col>
          </Row>

          {/* Copyright */}
          <div className="mt-10 border-t border-gray-300 pt-6 text-center text-black">
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
