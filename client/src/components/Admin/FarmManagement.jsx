import React, { useState, useEffect } from "react"; // Import React và các hook useState, useEffect
import axios from "axios"; // Import axios để thực hiện các yêu cầu HTTP
import { useCookies } from "react-cookie"; // Import useCookies để lấy và sử dụng cookie
import { jwtDecode } from "jwt-decode"; // Import jwtDecode để giải mã token JWT

const FarmManagement = () => {
  const [cookies] = useCookies(["token"]); // Lấy cookie "token" từ trình duyệt
  const token = cookies.token; // Lấy giá trị token từ cookie để sử dụng trong các yêu cầu
  const [decodedToken, setDecodedToken] = useState(null); // Khởi tạo state để lưu thông tin token đã giải mã
  const [farms, setFarms] = useState([]); // Khởi tạo state để lưu danh sách các trang trại (farms)
  const [newFarm, setNewFarm] = useState({
    farmName: "", // Tên trang trại
    farmPhoneNumber: "", // Số điện thoại của trang trại
    farmEmail: "", // Email của trang trại
    farmAddress: "", // Địa chỉ của trang trại
    farmImage: "", // URL hình ảnh của trang trại
    createdBy: "", // Thông tin người tạo trang trại, sẽ được lấy từ token
  });

  const [editFarm, setEditFarm] = useState(null); // State để lưu thông tin trang trại đang được chỉnh sửa

  // useEffect để giải mã token và lưu thông tin người dùng vào state khi token thay đổi
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Giải mã token để lấy thông tin người dùng
        setDecodedToken(decoded); // Lưu token đã giải mã vào state
        setNewFarm((prevFarm) => ({
          ...prevFarm,
          createdBy: decoded.sub, // Giả sử "sub" là ID của người dùng, lưu vào thuộc tính createdBy
        }));
      } catch (error) {
        console.error("Error decoding token:", error); // In ra lỗi nếu có vấn đề khi giải mã token
      }
    }
  }, [token]); // useEffect sẽ chạy mỗi khi giá trị `token` thay đổi

  // useEffect để lấy danh sách trang trại từ API khi component được load
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/koi-farm/list-farm", // Gọi API lấy danh sách trang trại từ backend
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token để xác thực người dùng
            },
          }
        );
        setFarms(response.data); // Lưu danh sách trang trại vào state
      } catch (error) {
        console.error("Error fetching farms:", error); // In ra lỗi nếu có vấn đề khi lấy danh sách trang trại
      }
    };

    fetchFarms(); // Gọi hàm lấy danh sách trang trại khi component được load
  }, [token]); // useEffect sẽ chạy mỗi khi token thay đổi

  // Hàm để tạo trang trại mới
  const createFarm = async () => {
    try {
      await axios.post("http://localhost:8080/koi-farm/create", newFarm, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực người dùng khi tạo trang trại
        },
      });
      // Sau khi tạo thành công, reset lại form
      setNewFarm({
        farmName: "",
        farmPhoneNumber: "",
        farmEmail: "",
        farmAddress: "",
        farmImage: "",
        createdBy: decodedToken?.sub || "", // Đảm bảo rằng ID người tạo được giữ nguyên
      });
      // Lấy lại danh sách trang trại sau khi tạo thành công
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token để xác thực
          },
        }
      );
      setFarms(response.data); // Cập nhật lại danh sách trang trại sau khi tạo
    } catch (error) {
      console.error("Error creating farm:", error); // Xử lý lỗi khi tạo trang trại
    }
  };

  // Hàm để xóa trang trại dựa theo ID
  const deleteFarm = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/koi-farm/deleteFarm/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực khi xóa
        },
      });
      // Lấy lại danh sách trang trại sau khi xóa thành công
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token để xác thực
          },
        }
      );
      setFarms(response.data); // Cập nhật lại danh sách trang trại sau khi xóa
    } catch (error) {
      console.error(
        "Error deleting farm:",
        error.response?.data || error.message // Xử lý lỗi khi xóa trang trại
      );
    }
  };

  // Hàm để cập nhật trang trại dựa theo ID
  const updateFarm = async (id) => {
    try {
      await axios.put(`http://localhost:8080/koi-farm/update/${id}`, editFarm, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực khi cập nhật
        },
      });
      setEditFarm(null); // Sau khi cập nhật xong, reset trạng thái chỉnh sửa
      // Lấy lại danh sách trang trại sau khi cập nhật
      const response = await axios.get(
        "http://localhost:8080/koi-farm/list-farm",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token để xác thực
          },
        }
      );
      setFarms(response.data); // Cập nhật lại danh sách trang trại sau khi cập nhật
    } catch (error) {
      console.error(
        "Error updating farm:",
        error.response?.data || error.message // Xử lý lỗi khi cập nhật trang trại
      );
    }
  };

  // Hàm để xử lý khi nhập liệu cho form tạo trang trại
  const handleInputChange = (e) => {
    setNewFarm({
      ...newFarm,
      [e.target.name]: e.target.value, // Cập nhật giá trị mới cho từng trường trong form dựa trên name của input
    });
  };

  // Hàm để xử lý khi nhập liệu cho form chỉnh sửa trang trại
  const handleEditChange = (e) => {
    setEditFarm({
      ...editFarm,
      [e.target.name]: e.target.value, // Cập nhật giá trị mới cho từng trường trong form chỉnh sửa dựa trên name của input
    });
  };

  // Hàm để gán trang trại đang được chỉnh sửa
  const handleEditClick = (farm) => {
    setEditFarm(farm); // Gán trang trại cần chỉnh sửa vào state
  };

  // Render giao diện của component FarmManagement
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Farm Management</h2>

      {/* Form tạo trang trại mới */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Create New Farm</h3>
        <input
          type="text"
          name="farmName"
          value={newFarm.farmName}
          onChange={handleInputChange}
          placeholder="Farm Name" // Input cho tên trang trại
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="farmPhoneNumber"
          value={newFarm.farmPhoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number" // Input cho số điện thoại trang trại
          className="border p-2 mb-2"
        />
        <input
          type="email"
          name="farmEmail"
          value={newFarm.farmEmail}
          onChange={handleInputChange}
          placeholder="Email" // Input cho email trang trại
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="farmAddress"
          value={newFarm.farmAddress}
          onChange={handleInputChange}
          placeholder="Address" // Input cho địa chỉ trang trại
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="farmImage"
          value={newFarm.farmImage}
          onChange={handleInputChange}
          placeholder="Image URL" // Input cho URL hình ảnh trang trại
          className="border p-2 mb-2"
        />
        <button
          onClick={createFarm} // Nút để tạo trang trại mới khi nhấn
          className="bg-blue-500 text-white px-4 py-2"
        >
          Create Farm
        </button>
      </div>

      {/* Form chỉnh sửa trang trại */}
      {editFarm && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Edit Farm</h3>
          <input
            type="text"
            name="farmName"
            value={editFarm.farmName}
            onChange={handleEditChange}
            placeholder="Farm Name" // Input chỉnh sửa tên trang trại
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="farmPhoneNumber"
            value={editFarm.farmPhoneNumber}
            onChange={handleEditChange}
            placeholder="Phone Number" // Input chỉnh sửa số điện thoại trang trại
            className="border p-2 mb-2"
          />
          <input
            type="email"
            name="farmEmail"
            value={editFarm.farmEmail}
            onChange={handleEditChange}
            placeholder="Email" // Input chỉnh sửa email trang trại
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="farmAddress"
            value={editFarm.farmAddress}
            onChange={handleEditChange}
            placeholder="Address" // Input chỉnh sửa địa chỉ trang trại
            className="border p-2 mb-2"
          />
          <input
            type="text"
            name="farmImage"
            value={editFarm.farmImage}
            onChange={handleEditChange}
            placeholder="Image URL" // Input chỉnh sửa URL hình ảnh trang trại
            className="border p-2 mb-2"
          />
          <button
            onClick={() => updateFarm(editFarm.id)} // Nút để lưu các thay đổi khi nhấn
            className="bg-green-500 text-white px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Bảng hiển thị danh sách các trang trại đã tạo với nút cập nhật và xóa */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Created Farms</h3>
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Image URL</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(farms || []).map((farm) => (
              <tr key={farm.id}>
                <td className="border px-4 py-2">{farm.farmName || "N/A"}</td>
                <td className="border px-4 py-2">
                  {farm.farmPhoneNumber || "N/A"}
                </td>
                <td className="border px-4 py-2">{farm.farmEmail || "N/A"}</td>
                <td className="border px-4 py-2">
                  {farm.farmAddress || "N/A"}
                </td>
                <td className="border px-4 py-2">{farm.farmImage || "N/A"}</td>
                <td className="border px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(farm)} // Nút để chỉnh sửa trang trại
                    className="bg-yellow-500 text-white px-4 py-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteFarm(farm.id)} // Nút để xóa trang trại
                    className="bg-red-500 text-white px-4 py-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmManagement; // Xuất component ra để sử dụng nơi khác
