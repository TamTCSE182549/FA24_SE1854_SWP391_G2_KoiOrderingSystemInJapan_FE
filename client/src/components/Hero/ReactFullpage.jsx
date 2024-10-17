import React from "react";
import FullPage, {
  FullPageSections,
  FullpageSection,
  FullpageNavigation,
} from "@ap.cx/react-fullpage";
import Img1 from "../../assets/Screenshot 2024-10-08 130030.png";
import { Slide, Fade } from "react-awesome-reveal";
import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";
const CardsData = [
  {
    id: 1,
    img: Img1,
    title: "Sunset",
    desc: "Each character will appear one by one",
    link: "/tour",
  },
  {
    id: 2,
    img: Img1,
    title: "Dog",
    desc: "Each character will appear one by one",
    link: "/koiforsale",
  },
  {
    id: 3,
    img: Img1,
    title: "Sunrise",
    desc: "Each character will appear one by one",
    link: "/farm",
  },
];

const ReactFullpage = () => {
  const navigate = useNavigate();
  const handleSwitch = (link) => {
    navigate(link);
  };

  return (
    <FullPage>
      <FullpageNavigation />

      <FullPageSections>
        <FullpageSection>
          <Carousel
            autoplay
            infinite={true}
            autoplaySpeed={3000}
            dotPosition="bottom"
          >
            {CardsData.map(({ id, img, title, desc, link }) => (
              <div
                key={id}
                className="text-white shadow-md rounded-lg overflow-hidden relative group"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-[100vh] object-cover rounded-lg"
                />

                {/* Overlay section */}
                <div className="absolute inset-0 left-[100%] opacity-0 group-hover:opacity-100 group-hover:left-0 p-4 w-full h-full bg-black/60 group-hover:backdrop-blur-sm duration-500 ease-in-out text-center">
                  <div className="space-y-4 flex flex-col justify-center h-full">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-lg">{desc}</p>
                    <button
                      className="border border-white px-4 py-2 rounded-lg hover:bg-black/20 duration-300 w-[300px] mx-auto"
                      onClick={() => handleSwitch(link)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </FullpageSection>

        <FullpageSection className="bg-red-500">
          <h1>Section 2</h1>
        </FullpageSection>

        <FullpageSection>
          <h1>Section 3</h1>
        </FullpageSection>
      </FullPageSections>
    </FullPage>
  );
};

export default ReactFullpage;
