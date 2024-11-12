import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import { Spin, Alert, Carousel, Card, Button } from "antd"; // Removed Button

const FarmDetail = () => {
  const navigate = useNavigate(); // Get the navigate function
  const { id } = useParams(); // Get the farm ID from URL parameters
  const [farmDetail, setFarmDetail] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/koi-farm/get/${id}`
        );
        setFarmDetail(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch farm details:", error.response || error);
        setError("Failed to fetch farm details");
        setLoading(false);
      }
    };
    fetchFarmDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-40 backdrop-filter backdrop-blur-3xl">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="relative">
            Back to Previous Page
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100"></span>
          </span>
        </button>
      </div>

      {farmDetail ? (
        <>
          <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row">
            {/* Farm Image Carousel */}
            <div className="md:w-1/2 mb-6 md:mb-0">
              <Carousel autoplay autoplaySpeed={3000}>
                {farmDetail.koiFarmImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.imageUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Farm Information */}
            <div className="md:w-1/2 md:pl-8 bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                {farmDetail.farmName}
              </h1>
              <div className="mb-4">
                <p className="flex items-center text-gray-700 text-lg mb-2">
                  <strong>Address:</strong> {farmDetail.farmAddress}
                </p>
                <p className="flex items-center text-gray-700 text-lg mb-2">
                  <strong>Phone:</strong> 📞 {farmDetail.farmPhoneNumber}
                </p>
                <p className="flex items-center text-gray-700 text-lg mb-2">
                  <strong>Email:</strong> 📧 {farmDetail.farmEmail}
                </p>
                <a
                  href={farmDetail.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 text-lg mb-2 hover:underline"
                >
                  <strong>Website:</strong> 🌐 {farmDetail.website}
                </a>
                <p className="text-gray-700 text-lg mb-2">
                  <strong>Description:</strong>{" "}
                  {farmDetail.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Koi Fish Carousel */}
          <div className="mt-10">
            <h2 className="text-3xl font-semibold mb-6 text-center text-black">
              Koi Fish Available
            </h2>
            <Carousel
              dots={true}
              slidesToShow={4} // Show 4 cards at a time
              arrows={true} // Enable navigation arrows
              autoplay={false} // Disable autoplay
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                  },
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                  },
                },
              ]}
            >
              {farmDetail.koiResponses.map((fish) => (
                <div key={fish.id} className="p-2">
                  <Card
                    hoverable
                    className="mx-2 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                    cover={
                      <img
                        src={fish.koiImageList[0].imageUrl}
                        alt={fish.name}
                        style={{ height: "400px" }}
                        className="object-cover rounded-t-lg w-full"
                      />
                    }
                    onClick={() => navigate(`/koi/${fish.id}`)}
                  >
                    <Card.Meta
                      title={
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">
                            {fish.koiName}
                          </span>
                          <Button
                            type="link"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/koi/${fish.id}`);
                            }}
                          >
                            View Details →
                          </Button>
                        </div>
                      }
                      description={
                        <div className="text-gray-600">
                          {/* <p>Size: {fish.koiId}</p>
                          <p>Age: {fish.age}</p> */}
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        </>
      ) : (
        <p className="text-center">Farm details not available.</p>
      )}
    </div>
  );
};

export default FarmDetail;
