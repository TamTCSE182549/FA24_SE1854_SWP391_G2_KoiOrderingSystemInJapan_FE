import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Carousel } from "antd";

import Logo from "../../assets/bg_f8f8f8-flat_750x_075_f-pad_750x1000_f8f8f8-removebg-preview.png";
import Im1 from "../../assets/1.jpg";
import Im2 from "../../assets/2.jpg";
import Im3 from "../../assets/3.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen">
        <Carousel
          ref={carouselRef}
          autoplay
          effect="fade"
          autoplaySpeed={5000}
          dots={false}
        >
          {[Im1, Im2, Im3].map((img, index) => (
            <div key={index} className="relative h-screen">
              <img
                src={img}
                alt={`slide-${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </Carousel>

        {/* Hero Content - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-7xl font-serif text-white mb-6"
            >
              <span className="text-red-500">Koi</span> Ordering System
              <br />
              In <span className="text-red-500">Japan</span>
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Experience exclusive tours to Japan's finest Koi farms. 
              Connect with master breeders, learn breeding techniques, 
              and select premium Koi for your collection.
            </motion.p>
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 
                         rounded-full text-lg transition duration-300 
                         transform hover:scale-105"
              onClick={() => navigate('/tour')}
            >
              Explore Our Tours
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
