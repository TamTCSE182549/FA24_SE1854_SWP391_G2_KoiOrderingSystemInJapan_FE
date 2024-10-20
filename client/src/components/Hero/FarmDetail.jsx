import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Spin, Alert, Carousel, Card } from "antd"; // Added Carousel and Card components

const FarmDetail = () => {
  const { id } = useParams(); // Get the farm ID from URL parameters
  const [farmDetail, setFarmDetail] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  // Hardcoded Data for Testing
  const mockFarmDetail = {
    farmName: "Sakura Koi Farm",
    farmAddress: "123 Sakura Street, Kyoto, Japan",
    farmPhoneNumber: "+81-123-456-789",
    farmEmail: "contact@sakurakoifarm.jp",
    description:
      "Sakura Koi Farm is one of the top koi farms in Japan, known for its high-quality koi breeding and beautiful facilities. Visitors can enjoy guided tours and learn about the art of koi breeding.",
    farmImage: "https://via.placeholder.com/400x300?text=Sakura+Koi+Farm",
    koiFish: [
      {
        id: 1,
        name: "Koi Fish A",
        size: "25 cm",
        age: "2 years",
        image: "https://via.placeholder.com/200x150?text=Koi+Fish+A",
      },
      {
        id: 2,
        name: "Koi Fish B",
        size: "30 cm",
        age: "3 years",
        image: "https://via.placeholder.com/200x150?text=Koi+Fish+B",
      },
      {
        id: 3,
        name: "Koi Fish C",
        size: "20 cm",
        age: "1 year",
        image: "https://via.placeholder.com/200x150?text=Koi+Fish+C",
      },
    ],
  };

  const useMockData = true; // Change this to false to switch back to API

  useEffect(() => {
    const fetchFarmDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/koi-farm/list-farm/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFarmDetail(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch farm details:", error.response || error);
        setError("Failed to fetch farm details");
        setLoading(false);
      }
    };

    if (useMockData) {
      // Use the mock data if toggle is set to true
      setFarmDetail(mockFarmDetail);
      setLoading(false);
    } else if (token) {
      fetchFarmDetail();
    } else {
      setError("No token available. Please log in.");
      setLoading(false);
    }
  }, [id, token, useMockData]);

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
            {/* Farm Image */}
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img
                src={
                  farmDetail.farmImage ||
                  "https://via.placeholder.com/400x300?text=Farm+Image"
                }
                alt={farmDetail.farmName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Farm Information */}
            <div className="md:w-1/2 md:pl-8">
              <h1 className="text-3xl font-bold mb-4 text-gray-700">
                {farmDetail.farmName}
              </h1>
              <p className="text-gray-700 text-lg mb-2">
                <strong>Address:</strong> {farmDetail.farmAddress}
              </p>
              <p className="text-gray-700 text-lg mb-2">
                <strong>Phone:</strong> 📞 {farmDetail.farmPhoneNumber}
              </p>
              <p className="text-gray-700 text-lg mb-2">
                <strong>Email:</strong> 📧 {farmDetail.farmEmail}
              </p>
              <p className="text-gray-700 text-lg mb-2">
                <strong>Description:</strong>{" "}
                {farmDetail.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Koi Fish Carousel */}
          <div className="mt-10">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Koi Fish Available
            </h2>
            <Carousel
              dots={true}
              slidesToShow={3}
              autoplay
              autoplaySpeed={3000}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                  },
                },
              ]}
            >
              {farmDetail.koiFish.map((fish) => (
                <div key={fish.id} className="p-4">
                  <Card
                    hoverable
                    className="mx-2 rounded-lg overflow-hidden shadow-lg"
                    cover={
                      <img
                        src={fish.image}
                        alt={fish.name}
                        className="object-cover h-100 w-full rounded-t-lg"
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <span className="text-lg font-bold">{fish.name}</span>
                      }
                      description={
                        <div className="text-gray-600">
                          <p>Size: {fish.size}</p>
                          <p>Age: {fish.age}</p>
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
