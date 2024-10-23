import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const KoiDetail = () => {
  const { id } = useParams(); // Get the ID from the route parameters
  const [koiData, setKoiData] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    // Fetch koi data by ID
    axios
      .get(`http://localhost:8080/kois/getby/${id}`)
      .then((response) => {
        setKoiData(response.data);
        console.log(response.data.koiImageList); // Debug: Log the koiImageList
        if (
          response.data.koiImageList &&
          response.data.koiImageList.length > 0
        ) {
          setMainImage(response.data.koiImageList[0].imageUrl); // Set the first image as the main image
        }
      })
      .catch((error) => {
        console.error("Error fetching koi data:", error);
      });
  }, [id]);

  if (!koiData) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  return (
    <div className="flex justify-center pt-4 mt-40">
      <div className="w-full max-w-4xl mx-auto px-6 py-12 bg-white shadow-lg rounded-lg ">
        <div className="flex flex-wrap -mx-4">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 px-4 mb-8">
            <div className="flex-1 mb-4">
              <img
                src={mainImage || "default-image-url"} // Use a default image if mainImage is not set
                alt={koiData.koiName}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {koiData.koiImageList &&
                koiData.koiImageList.map((imgObj, index) => (
                  <img
                    key={index}
                    src={imgObj.imageUrl}
                    alt={`${koiData.koiName} - view ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer transition duration-300 hover:opacity-75"
                    onClick={() => setMainImage(imgObj.imageUrl)}
                  />
                ))}
            </div>
          </div>

          {/* Koi Information */}
          <div className="w-full lg:w-1/2 px-4 bg-white bg-opacity-90">
            <h1 className="text-4xl font-bold mb-4 text-black">
              {koiData.koiName}
            </h1>

            <div className="mb-8 bg-gray-100 bg-opacity-80 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Specifications
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Koi Bekko size: </span>
                  {"15 – 45"}
                </li>
                <li>
                  <span className="font-medium">Name:</span> {koiData.koiName}
                </li>
                <li>
                  <span className="font-medium">Origin:</span> {koiData.origin}
                </li>
                <li>
                  <span className="font-medium">Color:</span> {koiData.color}
                </li>
                <li>
                  <span className="font-medium">Diet:</span> Gobble
                </li>
              </ul>
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md">
              Contact Us
            </button>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16">
          <Tabs
            defaultActiveKey="1"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <TabPane tab="Description" key="1">
              <p className="text-gray-700 leading-relaxed">
                {koiData.description}
              </p>
            </TabPane>
            <TabPane tab="Care Instructions" key="2">
              <p className="text-gray-700 leading-relaxed">
                {koiData.careInstructions}
              </p>
            </TabPane>
            <TabPane tab="Shipping Information" key="3">
              <p className="text-gray-700 leading-relaxed">
                {koiData.shippingInfo}
              </p>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default KoiDetail;
