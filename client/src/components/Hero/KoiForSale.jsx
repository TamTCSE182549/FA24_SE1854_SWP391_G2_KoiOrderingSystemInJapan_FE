import React, { useEffect, useState } from "react";
import { Input, Pagination, Card, Typography, Spin } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const { Title } = Typography;

// ProductCard với thiết kế mới
const ProductCard = ({ koi }) => {
  const navigate = useNavigate();
  const { id, koiName, koiImageList, variety, size, farm } = koi;

  const imageUrl = koiImageList?.length > 0 
    ? koiImageList[0].imageUrl 
    : "default-image-url";

  return (
    <Card
      hoverable
      className="overflow-hidden transition-all duration-300 hover:shadow-xl"
      bodyStyle={{ padding: 0 }}
      cover={
        <div className="relative group">
          <img 
            src={imageUrl} 
            alt={koiName} 
            className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={() => navigate(`/koi/${id}`)}
              className="bg-white text-gray-800 px-6 py-2 rounded-full flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <EyeOutlined />
              <span>View Details</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {koiName}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          {variety && <p>Variety: {variety}</p>}
          {size && <p>Size: {size} cm</p>}
          {farm && <p>Farm: {farm}</p>}
        </div>
      </div>
    </Card>
  );
};

// ProductGrid với thiết kế mới
const ProductGrid = ({ products, currentPage, itemsPerPage, onPageChange, onSearch, loading }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <Title level={2} className="!text-4xl font-bold text-gray-800">
          Premium Koi Collection
        </Title>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of high-quality Koi fish, 
          each one unique and beautiful in its own way.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <Input
          placeholder="Search by name, variety, or farm..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-md text-base py-2 px-4 rounded-full"
          size="large"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map((koi) => (
              <ProductCard key={koi.id} koi={koi} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={itemsPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        </>
      )}
    </div>
  );
};

// Component chính với loading state
const KoiForSale = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["token"]);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchKois = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/kois/all/active");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching koi data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKois();
  }, [cookies]);

  const handleSearch = (searchTerm) => {
    const filtered = products.filter(koi => 
      koi.koiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (koi.variety && koi.variety.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (koi.farm && koi.farm.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 mt-20">
        <ProductGrid
          products={filteredProducts}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default KoiForSale;
