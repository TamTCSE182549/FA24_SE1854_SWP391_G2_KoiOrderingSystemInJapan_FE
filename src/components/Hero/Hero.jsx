import React from "react";
import ImgF from "../../assets/yyy9eozrvny3kslirjgcyxcvu2lgf7crxbdhxp79fevfsd352w6npqwnz3qikmvk-o.jpg";
import { Carousel } from "antd";
// Dữ liệu MenuHero
const menuHeroData = [
  {
    id: 1,
    img: ImgF,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 2,
    img: ImgF,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 3,
    img: ImgF,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 4,
    img: ImgF,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];
const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const Hero = () => {
  return (
    <>
      <div className="container mx-auto">
        <div className=" justify-center items-center">
          {/* top of hero */}
          <div className=" flex m-auto w-[90%] h-[40%] border-white px-10 py-10 bg-gradient-to-r from-blue-600 to-cyan-500 mt-10 rounded-3xl ">
            <div className="w-full">
              <Carousel
                autoplay
                arrows
                infinite="false"
                autoplaySpeed={3000}
                arrowSize={50}
              >
                {menuHeroData.map((item) => (
                  <div
                    key={item.id}
                    className="flex pt-[2%] pb-[2%] pr-[2%] pl-[2%] rounded-3xl items-center justify-between h-[40%]"
                    style={contentStyle}
                  >
                    {/* Hình ảnh */}
                    <div className="w-[49%] shadow-2xl">
                      <img
                        src={item.img}
                        className=" object-contain rounded-3xl float-left"
                        alt={item.title}
                      />
                    </div>
                    {/* Văn bản */}
                    <div>
                      <p className="text-white text-lg w-[50%] float-right">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className="pt-10 pb-10">
          <div>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
              praesentium deleniti nulla officia sit temporibus? Ipsam iusto at
              nihil consequatur, iure molestias, officia libero vel ipsum ea
              dicta fugiat! Libero?
            </p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
              praesentium deleniti nulla officia sit temporibus? Ipsam iusto at
              nihil consequatur, iure molestias, officia libero vel ipsum ea
              dicta fugiat! Libero?
            </p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
              praesentium deleniti nulla officia sit temporibus? Ipsam iusto at
              nihil consequatur, iure molestias, officia libero vel ipsum ea
              dicta fugiat! Libero?
            </p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus
              praesentium deleniti nulla officia sit temporibus? Ipsam iusto at
              nihil consequatur, iure molestias, officia libero vel ipsum ea
              dicta fugiat! Libero?
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
