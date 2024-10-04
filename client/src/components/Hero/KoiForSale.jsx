import React, { useState, useEffect } from "react";
import { Input, Card, Row, Col, Checkbox, Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios"; // Sử dụng axios cho việc gọi API

const Sidebar = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-gray-100 p-4 w-full">
      <h3 className="text-xl font-semibold mb-4">Filter by Category</h3>
      <Checkbox.Group
        options={["Category 1", "Category 2", "Category 3"]}
        onChange={onFilterChange}
        value={filters}
        className="flex flex-col" // Sử dụng Tailwind CSS để hiển thị theo cột
      />

      <Button className="mt-4 w-full" type="primary" danger>
        Reset Filters
      </Button>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Card title={product.name} bordered={false} className="mb-4">
      <p>{product.category}</p>
      <p>{product.price}</p>
    </Card>
  );
};

const ProductDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mảng sản phẩm tĩnh (5 sản phẩm) để sử dụng với map
  const staticProducts = [
    { id: 1, name: "Product A", category: "Category 1", price: "$100" },
    { id: 2, name: "Product B", category: "Category 2", price: "$150" },
    { id: 3, name: "Product C", category: "Category 1", price: "$200" },
    { id: 4, name: "Product D", category: "Category 3", price: "$250" },
    { id: 5, name: "Product E", category: "Category 2", price: "$300" },
  ];

  // Gọi API để lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Thay thế URL API thật vào đây, ví dụ: 'https://api.example.com/products'
        const response = await axios.get("https://api.example.com/products");
        setProducts(response.data); // Giả sử API trả về mảng sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
        // Nếu gọi API thất bại, hiển thị danh sách sản phẩm tĩnh
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc các sản phẩm dựa trên tìm kiếm và bộ lọc
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.length === 0 || filters.includes(product.category))
    );
  });

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4">
        <Sidebar filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        {/* Search Bar */}
        <Input
          placeholder="Search for products"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* Hiển thị loading khi đang fetch API */}
        {loading ? (
          <Spin size="large" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col span={8} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <p>No products found</p>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
