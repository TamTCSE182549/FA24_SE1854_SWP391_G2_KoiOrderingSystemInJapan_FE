import React, { useRef } from "react";
import ImgF from "../../assets/yyy9eozrvny3kslirjgcyxcvu2lgf7crxbdhxp79fevfsd352w6npqwnz3qikmvk-o.jpg";
import { Carousel } from "antd";
import Img1 from "../../assets/321.jpg";
import Img2 from "../../assets/291281.jpg";
import Img3 from "../../assets/koi+shopping.jpg";
import Im1 from "../../assets/1.jpg";
import Im2 from "../../assets/2.jpg";
import Im3 from "../../assets/3.jpg";

import { Slide, Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import Footer from "../Footer/Footer";

// Dữ liệu MenuHero
const CardsData = [
  {
    id: 1,
    img: Img2,
    title: "Koi Products",
    desc: "Each character will appear one by one",
    link: "/koiforsale", // Correct link
  },
  {
    id: 2,
    img: Img3,
    title: "Koi Of Farm",
    desc: "Each character will appear one by one",
    link: "/farm", // Correct link
  },
  {
    id: 3,
    img: Img1,
    title: "Buying Koi Tours",
    desc: "Each character will appear one by one",
    link: "/tour", // Correct link
  },
  {
    id: 4,
    img: Img1,
    title: "Sunset",
    desc: "Each character will appear one by one",
    link: "/tour", // Correct link
  },
];

const CarouselItem = [
  {
    id: 1,
    img: Im1,
  },
  {
    id: 2,
    img: Im2,
  },
  {
    id: 3,
    img: Im3,
  },
];

const Hero = () => {
  const newsRef = useRef(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null); // Create a reference for the carousel

  // Function to go to the previous slide
  const goToPrevSlide = () => {
    carouselRef.current.prev(); // Access the carousel's prev method
  };

  // Function to go to the next slide
  const goToNextSlide = () => {
    carouselRef.current.next(); // Access the carousel's next method
  };

  const handleSwitch = (link) => {
    navigate(link); // Use navigate from react-router-dom
  };

  return (
    <div className="mx-auto max-w-[100%] overflow-hidden z-10 ">
      <div className="w-full h-[100vh] relative">
        {/* Ensure carousel container takes full viewport height */}
        <Carousel
          ref={carouselRef} // Attach ref to the Carousel
          autoplay
          autoplaySpeed={10000}
          dotPosition="bottom"
          pauseOnHover={false}
        >
          {CarouselItem.map(({ id, img }) => (
            <div key={id} className="relative w-full h-[100vh]">
              {/* Ensure each slide takes full viewport height */}
              <img
                src={img}
                alt={`carousel-img-${id}`}
                className="w-screen h-full object-cover" // Full image cover
              />
              {/* View Now Button inside each carousel slide */}
            </div>
          ))}
        </Carousel>

        {/* Custom Prev Button */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4 py-2 rounded-full z-10 hover:text-red-500 duration-300"
        >
          <FaArrowCircleLeft />
        </button>

        {/* Custom Next Button */}
        <button
          onClick={goToNextSlide}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4 py-2 rounded-lg z-10 hover:text-red-500 duration-300"
        >
          <FaArrowCircleRight />
        </button>
        <button
          className="bg-red-500 hover:bg-red-800 text-white font-bold rounded-full px-20 py-5 mb-20 bottom-1/4 absolute  center right-1/2 transform translate-x-1/2 -translate-y-1/2 "
          onClick={() => {
            newsRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          EXPLORE
        </button>
        <p className="absolute font-serif text-gray-100 bottom-1/4 left-1/2 transform px-20 mb-15  center -translate-x-1/2 -translate-y-1/2 text-9xl text-center">
          WELCOME <br />
          TO <br />
          MY WEBSITE
        </p>
      </div>
      <div ref={newsRef} className="w-full h-[100vh]">
        <div className="mt-5 pt-10 pl-10 px-1">
          <p className="text-5xl font-serif text-white">KOI WEBSITE MENU</p>
        </div>
        <div className="my-20 px-10 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 place-items-center items-center gap-20">
            {CardsData.map(({ id, img, title, desc, link }) => (
              <div
                key={id}
                className="text-white shadow-md rounded-lg overflow-hidden relative group "
              >
                <img
                  src={img}
                  alt=""
                  className="w-[700px] h-[400px] rounded-lg"
                />
                {/* overlay section */}
                <div className="absolute left-0 top-[-100%] opacity-0 group-hover:opacity-100 group-hover:top-[0] p-4 w-full h-full bg-black/60 group-hover:backdrop-blur-sm duration-500">
                  <div className="space-y-4">
                    <Slide cascade>
                      <h1 className="text-4xl font-serif">{title}</h1>
                      <Fade cascade damping={0.05}>
                        {desc}
                      </Fade>
                      <div>
                        <button
                          onClick={() => handleSwitch(link)} // Pass the correct link here
                          className="border border-white px-4 py-2 -my-7 rounded-lg hover:bg-white hover:text-black hover:shadow-sm duration-300  right-10 absolute top-60 "
                        >
                          View
                        </button>
                      </div>
                    </Slide>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky bottom-5 pl-96 translate-x-3/4 ">
        <button
          className=" hover:text-red-800 text-6xl  text-red-500 mb-5 px-4 py-2 rounded-full"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FaArrowAltCircleUp />
        </button>
      </div>
    </div>
  );
};

export default Hero;
