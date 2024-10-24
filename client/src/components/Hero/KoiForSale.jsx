import React, { useEffect, useState } from "react";
import { Input, Slider, Checkbox, Pagination, Button, Tag, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const { CheckableTag } = Tag;
const { Meta } = Card;



// const getFishesByCategory = async (categoryId) => {
//   try {
//     // Lấy thông tin danh mục từ API ban đầu
//     const categoryResponse = await axios.get(
//       `https://example.com/api/categories/${categoryId}`
//     );
//     const categoryData = categoryResponse.data;

//     // Dùng categoryId để lấy danh sách cá từ API khác
//     const fishesResponse = await axios.get(`https://example.com/api/fishes`, {
//       params: {
//         categoryId: categoryId,
//       },
//     });
//     const fishesData = fishesResponse.data;

//     console.log(fishesData); // Hiển thị danh sách cá
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// getFishesByCategory("123");

const Filters = () => {
  return (
    <>
      <div className="w-1/4 p-4 shadow-md">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            <Tag closable>Spring</Tag>
            <Tag closable>Smart</Tag>
            <Tag closable>Modern</Tag>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Label</h3>
          <Checkbox className="mb-2 text-white">
            Label <span className="text-white">Description</span>
          </Checkbox>
          <br />
          <Checkbox className="text-white mb-2">
            Label <span className="text-white">Description</span>
          </Checkbox>
          <br />
          <Checkbox className="text-white mb-2">
            Label <span className="text-white">Description</span>
          </Checkbox>
          <br />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Price Range</h3>
          <Slider range defaultValue={[50, 100]} min={0} max={200} />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Color</h3>
          <Checkbox className="mb-2">Label</Checkbox> <br />
          <Checkbox className="mb-2">Label</Checkbox> <br />
          <Checkbox>Label</Checkbox>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Size</h3>
          <Checkbox className="mb-2">Label</Checkbox> <br />
          <Checkbox className="mb-2">Label</Checkbox> <br />
          <Checkbox>Label</Checkbox>
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ id, name, img }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/koi/${id}`); // Navigate to the KoiDetail page with the id
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      <div className="h-100 overflow-hidden flex justify-center items-center">
        <img
          src={img}
          alt={name} // Use the name as alt text for better accessibility
          className="w-[350px] h-[450px] object-cover" // Set fixed width and height in pixels
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 text-center">
          {name}
        </h3>
        <div className="mt-auto flex justify-center">
          <button
            onClick={handleViewDetail} // Add onClick handler to navigate
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
    <div className="w-3/4 p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="w-1/2"
        />
        <div className="flex gap-2">
          <Button type="primary">New</Button>
          <Button>Price ascending</Button>
          <Button>Price descending</Button>
          <Button>Rating</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {currentProducts.map((item, index) => (
          <ProductCard
            key={index}
            id={item.id} // Ensure the API response includes an 'id' field
            name={item.koiName} // Ensure the API response includes a 'name' field
            img={
              item.koiImageList && item.koiImageList.length > 0
                ? item.koiImageList[0].imageUrl
                : "default-image-url"
            } // Check if koiImageList is not empty
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={products.length}
          pageSize={itemsPerPage}
          onChange={(page) => setCurrentPage(page)} // Ensure this updates the currentPage
        />
      </div>
    </div>
  );
};

const KoiForSale = () => {
  const [products, setProducts] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const token = cookies.token;

    axios
      .get("http://localhost:8080/kois/all", {})
      .then((response) => {
        setProducts(response.data); // Ensure response.data is an array of products with 'name' and 'img'
      })
      .catch((error) => {
        console.error("There was an error fetching the koi data!", error);
      });
  }, [cookies]);

  return (
    <div className="mt-20">
      <div className="flex pt-4 container mx-auto justify-between backdrop-filter backdrop-blur-3xl">
        <Filters />
        <ProductGrid
          products={products}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage} // Pass setCurrentPage to ProductGrid
        />
      </div>
    </div>
  );
};

export default KoiForSale;
