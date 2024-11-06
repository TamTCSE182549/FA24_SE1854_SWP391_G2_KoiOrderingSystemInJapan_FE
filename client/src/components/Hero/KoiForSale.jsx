import React, { useEffect, useState } from "react";
import { Input, Pagination, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

// Tách ProductCard thành component riêng
const ProductCard = ({ koi }) => {
  const navigate = useNavigate();
  const { id, koiName, koiImageList } = koi;

  const imageUrl = koiImageList?.length > 0 
    ? koiImageList[0].imageUrl 
    : "default-image-url";

  return (
    <Card
      hoverable
      className="h-full"
      cover={
        <img 
          src={imageUrl} 
          alt={koiName} 
          className="h-[350px] object-cover"
        />
      }
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-center mb-4">
          {koiName}
        </h3>
        <button
          onClick={() => navigate(`/koi/${id}`)}
          className="mt-auto w-full bg-green-600 text-white rounded-md 
                   px-4 py-2 hover:bg-green-700 transition duration-300"
        >
          View Detail
        </button>
      </div>
    </Card>
  );
};

// Tách ProductGrid thành component riêng
const ProductGrid = ({ products, currentPage, itemsPerPage, onPageChange, onSearch }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search Koi"
        prefix={<SearchOutlined />}
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((koi) => (
          <ProductCard key={koi.id} koi={koi} />
        ))}
      </div>

      <div className="flex justify-center">
        <Pagination
          current={currentPage}
          total={products.length}
          pageSize={itemsPerPage}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

// Component chính
const KoiForSale = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cookies] = useCookies(["token"]);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchKois = async () => {
      try {
        const response = await axios.get("http://localhost:8080/kois/all/active");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching koi data:", error);
      }
    };

    fetchKois();
  }, [cookies]);

  const handleSearch = (searchTerm) => {
    const filtered = products.filter(koi => 
      koi.koiName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 mt-20">
        <ProductGrid
          products={filteredProducts}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default KoiForSale;
