import React, { useEffect, useState } from "react";
import { Input, Pagination, Button, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Meta } = Card;

const ProductCard = ({ id, name, img }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/koi/${id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      <div className="h-100 overflow-hidden flex justify-center items-center">
        <img src={img} alt={name} className="w-full h-[350px] object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 text-center">
          {name}
        </h3>
        <div className="mt-auto flex justify-center">
          <button
            onClick={handleViewDetail}
            className="w-30 mx-auto bg-green-600 text-white rounded-md px-4 py-2 transition duration-300 ease-in-out hover:bg-green-700"
          >
            View Detail
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({
  products,
  currentPage,
  itemsPerPage,
  setCurrentPage,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {currentProducts.map((item, index) => (
          <ProductCard
            key={index}
            id={item.id}
            name={item.koiName}
            img={
              item.koiImageList && item.koiImageList.length > 0
                ? item.koiImageList[0].imageUrl
                : "default-image-url"
            }
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={products.length}
          pageSize={itemsPerPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

const KoiForSale = () => {
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const token = cookies.token;

    axios
      .get("http://localhost:8080/kois/all/active", {})
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the koi data!", error);
      });
  }, [cookies]);

  return (
    <div className="mt-20">
      <div className="pt-4 container mx-auto backdrop-filter backdrop-blur-3xl">
        <ProductGrid
          products={products}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default KoiForSale;
