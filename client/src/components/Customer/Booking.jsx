import React, { useState } from "react";
import {
  DatePicker,
  InputNumber,
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

const Booking = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // State lưu tour có sẵn hoặc tùy chọn
  const [tourType, setTourType] = useState("available");

  // Hàm xử lý khi đặt chỗ thành công
  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/booking-confirmation"); // Điều hướng đến trang xác nhận sau khi đặt thành công
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Thay đổi loại tour
  const handleTourTypeChange = (key) => {
    setTourType(key);
  };

  return (
    <div className=" flex justify-center items-center pt-10">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full ">
        <h2 className="text-2xl font-bold text-center mb-6">
          Japan Trip Booking
        </h2>

        <Tabs defaultActiveKey="available" onChange={handleTourTypeChange}>
          {/* Tab "Tour có sẵn" */}
          <TabPane tab="Available Tours" key="available">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              {/* Chọn tour có sẵn */}
              <Form.Item
                label="Choose Tour"
                name="availableTour"
                rules={[
                  {
                    required: tourType === "available",
                    message: "Please select a tour!",
                  },
                ]}
              >
                <Select placeholder="Select a tour" className="w-full">
                  <Option value="Tokyo Tour">Tokyo Tour</Option>
                  <Option value="Kyoto Cultural Tour">
                    Kyoto Cultural Tour
                  </Option>
                  <Option value="Mount Fuji Tour">Mount Fuji Tour</Option>
                </Select>
              </Form.Item>

              {/* Ngày đi */}
              <Form.Item
                label="Select Date"
                name="tripDate"
                rules={[
                  { required: true, message: "Please select your trip date!" },
                ]}
              >
                <DatePicker
                  disabledDate={(current) =>
                    current && current < moment().endOf("day")
                  }
                  className="w-full"
                />
              </Form.Item>

              {/* Số người tham gia */}
              <Form.Item
                label="Number of Participants"
                name="participants"
                rules={[
                  {
                    required: true,
                    message: "Please select the number of participants!",
                  },
                ]}
              >
                <InputNumber min={1} max={10} className="w-full" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-500"
                >
                  Book Now
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Tab "Tự đặt địa điểm" */}
          <TabPane tab="Custom Tour" key="custom">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              {/* Chọn địa điểm */}
              <Form.Item
                label="Select Destinations"
                name="customDestinations"
                rules={[
                  {
                    required: tourType === "custom",
                    message: "Please select at least one destination!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Choose destinations"
                  className="w-full"
                >
                  <Option value="Tokyo Tower">Tokyo Tower</Option>
                  <Option value="Kyoto Temple">Kyoto Temple</Option>
                  <Option value="Nara Deer Park">Nara Deer Park</Option>
                  <Option value="Hiroshima Peace Park">
                    Hiroshima Peace Park
                  </Option>
                </Select>
              </Form.Item>

              {/* Ngày đi */}
              <Form.Item
                label="Select Date"
                name="tripDate"
                rules={[
                  { required: true, message: "Please select your trip date!" },
                ]}
              >
                <DatePicker
                  disabledDate={(current) =>
                    current && current < moment().endOf("day")
                  }
                  className="w-full"
                />
              </Form.Item>

              {/* Số người tham gia */}
              <Form.Item
                label="Number of Participants"
                name="participants"
                rules={[
                  {
                    required: true,
                    message: "Please select the number of participants!",
                  },
                ]}
              >
                <InputNumber min={1} max={10} className="w-full" />
              </Form.Item>

              {/* Các dịch vụ tùy chọn */}
              <Form.Item name="extraOptions" valuePropName="checked">
                <Checkbox.Group>
                  <div className="flex flex-col gap-2">
                    <Checkbox value="hotel">Hotel Booking Included</Checkbox>
                    <Checkbox value="transport">
                      Transport from Airport
                    </Checkbox>
                    <Checkbox value="guide">Personal Tour Guide</Checkbox>
                    <Checkbox value="meals">Meals Included</Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-500"
                >
                  Book Custom Tour
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Booking;
