import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Spin, Alert, Carousel, Card, Button } from "antd"; // Import Button

const FarmDetail = () => {
  const { id } = useParams(); // Get the farm ID from URL parameters
  const [farmDetail, setFarmDetail] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigate for redirection

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
              <Button
                type="primary"
                className="mt-4"
                onClick={() => navigate("/tour")} // Navigate to the tour page
              >
                Book Tour
              </Button>
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
                    className="mx-2 rounded-lg overflow-hidden shadow-lg"
                    cover={
                      <img
                        src={fish.koiImageList[0].imageUrl}
                        alt={fish.name}
                        style={{ height: "400px" }} // Adjusted height for smaller cards
                        className="object-cover rounded-t-lg w-full"
                      />
                    }
                    onClick={() => navigate(`/koi/${fish.id}`)} // Navigate to KoiDetail with koiId
                  >
                    <Card.Meta
                      title={
                        <span className="text-lg font-bold">
                          {fish.koiName}
                        </span>
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
