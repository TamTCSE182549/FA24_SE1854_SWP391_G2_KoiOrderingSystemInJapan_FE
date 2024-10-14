import React from "react";
import { Input, Slider, Checkbox, Pagination, Button, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { CheckableTag } = Tag;

const mockData = [
  { name: "Tour name", location: "Location", price: "5.99$", rating: "Rating" },
  { name: "Tour name", location: "Location", price: "5.99$", rating: "Rating" },
  { name: "Tour name", location: "Location", price: "5.99$", rating: "Rating" },
  { name: "Tour name", location: "Location", price: "5.99$", rating: "Rating" },
  { name: "Tour name", location: "Location", price: "5.99$", rating: "Rating" },
  { name: "Tour name", location: "Location", price: "5.99$", rating: "Rating" },
];

const Filters = () => {
  return (
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
        <Checkbox className="mb-2">
          Label <span className="text-gray-400">Description</span>
        </Checkbox>{" "}
        <br />
        <Checkbox className="mb-2">
          Label <span className="text-gray-400">Description</span>
        </Checkbox>{" "}
        <br />
        <Checkbox>
          Label <span className="text-gray-400">Description</span>
        </Checkbox>{" "}
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
  );
};

const ProductCard = ({ name, location, price, rating }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="h-48 bg-gray-200 mb-4" /> {/* Placeholder cho hình ảnh */}
      <h3 className="font-semibold">{name}</h3>
      <p>{location}</p>
      <div className="font-bold">{price}</div>
      <p className="text-gray-500">{rating}</p>
    </div>
  );
};

const ProductGrid = () => {
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
        {mockData.map((item, index) => (
          <ProductCard
            key={index}
            name={item.name}
            location={item.location}
            price={item.price}
            rating={item.rating}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination defaultCurrent={1} total={500} />
      </div>
    </div>
  );
};

const KoiForSale = () => {
  return (
    <div className="flex min-h-screen ">
      <Filters />
      <ProductGrid />
    </div>
  );
};

export default KoiForSale;
