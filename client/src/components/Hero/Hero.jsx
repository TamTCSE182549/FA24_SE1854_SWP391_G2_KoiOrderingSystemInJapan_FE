import React from "react";
import ImgF from "../../assets/yyy9eozrvny3kslirjgcyxcvu2lgf7crxbdhxp79fevfsd352w6npqwnz3qikmvk-o.jpg";
import { Carousel, Row, Col } from "antd";
import Img1 from "../../assets/Screenshot 2024-10-08 130030.png";

// Dữ liệu MenuHero
const menuHeroData = [
  {
    id: 1,
    img: Img1,
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

const Hero = () => {
  return (
    <div className="w-full pb-10">
      <div className="flex justify-center items-center">
        {/* top of hero */}
        <div className="w-full border-white px-10 py-10 bg-[#c5bd92] mt-10 rounded-3xl">
          <div className="w-full">
            <Carousel autoplay arrows infinite={false} autoplaySpeed={3000}>
              {menuHeroData.map((item) => (
                <div key={item.id} className="w-full h-[600px]">
                  <Row gutter={[32, 32]} className="h-full" align="middle">
                    {/* Hình ảnh */}
                    <Col span={12} className="h-full">
                      <div className="h-full flex justify-center items-center pb-10">
                        <img
                          src={item.img}
                          className="object-cover w-full h-full rounded-3xl"
                          alt={item.title}
                          style={{ marginRight: "10px", overflow: "hidden" }}
                        />
                      </div>
                    </Col>

                    {/* Văn bản */}
                    <Col span={12} className="h-full">
                      <div className="h-full flex justify-center items-center text-white text-lg">
                        <p className="w-[80%] text-center leading-relaxed">
                          {item.title}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
      <div>
        <div className="w-[80%] mx-auto mt-10 bg-[#c5bd92]">
          <h1 className="text-black">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus non ad necessitatibus cumque earum quaerat, sit
            exercitationem aspernatur deserunt esse molestiae debitis ipsam
            architecto quam modi hic? Ipsam, ex itaque. Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Voluptatem animi dolores ipsa
            assumenda corrupti quos necessitatibus quo atque dolorum? Magni,
            iusto labore perspiciatis a placeat exercitationem? Blanditiis
            aperiam exercitationem incidunt?
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
