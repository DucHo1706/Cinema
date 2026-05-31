
import React, { useState, useEffect, useCallback } from "react";
import Nav from "../Header/nav";
import Bottom from "../Footer/bottom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import SCHEDULE from '../QL_lichchieu/schedule';
import RevenueList from "../QL_Doanhthu_GiamDoc/Doanhthu";
import GenreManagement from "./GenreManagement";
import StaffManagement from "./StaffManagement";
import CinemaManagement from "./CinemaManagement";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config/constants';

interface FoodItem {
    foodId: string;
    foodName: string;
    foodPrice: number;
}

interface OrderRequestItem {
    productId: string;
    quanlity: number;
}

// Define possible API response structures
interface ApiResponseFood {
    data?: FoodItem[];
    status?: string;
    message?: string;
    [key: string]: any; // Allow for other properties
}
interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}
// NEW INTERFACE: For food/drink items from API
interface FoodDrinkItem {
    itemId: string; // Assuming an ID for each item
    itemName: string; // The name of the food/drink item
    price: number; // Assuming price is also available
    // Add other fields if your API returns them
}

interface Genre {
    id: string;
    name: string;
    description: string;
}
interface Cinema {
    cinemaId: string;
    cinemaName: string;
    cinemaLocation: string;
    cinemaDescription?: string;
    cinemaContactNumber?: string;
}

const Info: React.FC = () => {
    const userEmail = localStorage.getItem("userEmail");
    const navigate = useNavigate();
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerEmail, setCustomerEmail] = useState('');
    const [orderItems, setOrderItems] = useState<OrderRequestItem[]>([]);
    const [selectedFoodId, setSelectedFoodId] = useState('');
    const [quanlity, setquanlity] = useState(1);
    const [errorFood, setErrorFood] = useState<string | null>(null);

    // Fetch food items and open modal on mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/Food/GetFoodInformation`)
            .then(response => {
                // Log the full response for debugging
                console.log('Full API Response:', response);
                // Check for nested data
                let items = response.data as ApiResponseFood;
                if (Array.isArray(items)) {
                    setFoodItems(items);
                } else if (items && typeof items === 'object') {
                    // Safely extract nested array
                    const foodData = items.data || [];
                    if (Array.isArray(foodData)) {
                        setFoodItems(foodData);
                    } else {
                        console.error('No valid array found in response:', response.data);
                        setErrorFood('Invalid food items data format');
                        setFoodItems([]);
                    }
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setErrorFood('Invalid food items data format');
                    setFoodItems([]);
                }
            })
            .catch(error => {
                console.error('Error fetching food items:', error);
                setErrorFood('Failed to fetch food items');
                setFoodItems([]);
            });

        // Open modal immediately
        setIsModalOpen(true);
    }, []);

    const handleAddItem = () => {
        if (selectedFoodId) {
            setOrderItems([...orderItems, { productId: selectedFoodId, quanlity }]);
            setSelectedFoodId('');
            setquanlity(1);
        }
    };
    
    const handleSubmitOrder = async () => {
        if (!customerEmail) {
            toast.warning('Vui lòng nhập email khách hàng!');
            return;
        }

        const orderData = {
            customerEmail,
            orderDate: new Date().toISOString(),
            orderRequestItems: orderItems
        };

        try {
            const userId = localStorage.getItem('IDND');
            await axios.post(
                `${API_BASE_URL}/api/StaffOrder/StaffOrder?UserId=${userId}`,
                orderData,
                {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    }
                }
            );
            setIsModalOpen(false);
            setOrderItems([]);
            setCustomerEmail('');
            toast.success('Đã gửi đơn hàng thành công!');
        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('Lỗi khi gửi đơn hàng!');
        }
    };
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Đã đổi tên biến trạng thái và hàm cập nhật
    const [message1, setMessage1] = useState('');

    const handleChangePassword = async () => {
        setMessage1(''); // Xóa thông báo cũ

        if (newPassword !== confirmPassword) {
            setMessage1('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }

        const payload = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };

        const apiUrl = `${API_BASE_URL}/api/Account/changePassword?userID=${localStorage.getItem('IDND')}`;
        console.log('id là', localStorage.getItem('IDND'));
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage1('Mật khẩu đã được cập nhật thành công!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                console.log('API Response:', await response.json());
            } else {
                const errorData = await response.json();
                setMessage1(`Lỗi: ${errorData.message || 'Có lỗi xảy ra khi đổi mật khẩu.'}`);
                console.error('API Error:', response.status, errorData);
            }
        } catch (error) {
            setMessage1('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
            console.error('Network or unexpected error:', error);
        }
    };

    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role") || null);
    const [activeTab, setActiveTab] = useState<"password" | "nhanvien" | "quanlynoidung" | "schedule" | "doanhthu" | "xacdinhdichvu" | "csphongrap" | "room" | "theloai" | "binhluan">("password");
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleDeleteStaffOrder = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };
    const roleName = localStorage.getItem('role') || '';
    const roles1: string[] = roleName ? roleName.split(',') : [];
    const [isCheckingRoles, setIsCheckingRoles] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [employeeId] = useState(localStorage.getItem("authToken"));
    const isDirector = roles1.includes('Director');
    const fetchCinemas = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Cinema/getCinemaList`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.status === "Success" && data.data) {
                setCinemas(data.data);
            }
        } catch (error) {
            console.error("Không thể tải danh sách rạp. Vui lòng thử lại sau.", error);
        }
    }, []);

    useEffect(() => {
        setIsCheckingRoles(true);
        const timer = setTimeout(() => {
            if (roles1.includes('FacilitiesManager') || roles1.includes('Director') || roles1.includes('MovieManager') || roles1.includes('Cashier') || roles1.includes('TheaterManager')) {
                setIsAuthorized(true);
                setIsCheckingRoles(false);
            } else {
                toast.error('Không được phép vào trang này');
                navigate('/login');
            }
        }, 1000); // 1-second delay to show spinner
        return () => clearTimeout(timer);
    }, []); // Empty dependency array for mount-only execution

    useEffect(() => {
        fetchCinemas();
    }, [fetchCinemas]);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')" }}>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <div className="sticky top-0 z-50 bg-slate-900 shadow-md mb-4">
                <div className="max-w-screen-xl mx-auto px-8"><Nav /></div>
            </div>
            <div className="max-w-6xl mx-auto py-10 px-4 md:flex gap-8">
                <div className="sticky top-32 h-fit self-start bg-white/20 backdrop-blur-md p-4 rounded-xl w-full md:w-1/4 space-y-4 shadow-lg">
                    <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "password" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("password")}>Đổi mật khẩu</button>
                    {(isDirector || roles1.includes('TheaterManager')) && (
                        <div className="mt-6 pt-6 border-t border-white/30">
                            <h3 className="text-lg font-bold text-DarkRed mb-4 text-yellow-400">Quản Lý Rạp</h3>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "nhanvien" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("nhanvien")}>Danh sách nhân viên</button>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "schedule" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("schedule")}>Tạo lịch chiếu</button>
                        </div>
                    )}
                    {(isDirector || roles1.includes('MovieManager')) && (
                        <div className="mt-6 pt-6 border-t border-white/30">
                            <h3 className="text-lg font-bold text-DarkRed mb-4 text-yellow-400">Quản Lý Nội Dung</h3>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium hover:bg-white/30 text-white`} onClick={() => navigate('/Addmovie')}>Quản Lý Phim</button>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "theloai" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("theloai")}>Quản Lý Thể Loại</button>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "binhluan" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("binhluan")}>Quản Lý Bình Luận</button>
                        </div>
                    )}
                    {(isDirector || roles1.includes('Cashier')) && (
                        <div className="mt-6 pt-6 border-t border-white/30">
                            <h3 className="text-lg font-bold text-DarkRed mb-4 text-yellow-400">Thu Ngân</h3>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "xacdinhdichvu" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("xacdinhdichvu")}>Xác nhận dịch vụ</button>
                        </div>
                    )}
                    {isDirector && (
                        <div className="mt-6 pt-6 border-t border-white/30">
                            <h3 className="text-lg font-bold text-DarkRed mb-4 text-yellow-400">Giám đốc</h3>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "doanhthu" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("doanhthu")}>Doanh thu</button>
                        </div>
                    )}
                    {(isDirector || roles1.includes('FacilitiesManager')) && (
                        <div className="mt-6 pt-6 border-t border-white/30">
                            <h3 className="text-lg font-bold text-DarkRed mb-4 text-yellow-400">Quản trị viên hệ thống</h3>
                            <button className={`w-full px-4 py-2 rounded-lg text-left font-medium ${activeTab === "csphongrap" ? "bg-yellow-300 text-black" : "hover:bg-white/30 text-white"}`} onClick={() => setActiveTab("csphongrap")}>Chỉnh sửa rạp</button>
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-8 mt-8 md:mt-0">
                    <h1 className="text-white text-3xl font-bold text-center uppercase">Cinema xin chào! {userEmail}</h1>

                    {activeTab === "password" && (
                        <div className="max-w-4xl mx-auto bg-white/10 rounded-xl shadow-2xl overflow-hidden p-8 animate-[slideInFromLeft_1s_ease-out]">
                            <div className="bg-white/10 p-6 rounded-2xl shadow-xl text-white">
                                <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-3 font-semibold">Mật khẩu cũ</label>
                                        <input
                                            type="password"
                                            className="w-full border rounded-md px-4 py-2 bg-white/10"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-semibold">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="w-full border rounded-md px-4 py-2 bg-white/10"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-semibold">Xác nhận mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="w-full border rounded-md px-4 py-2 bg-white/10"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {message1 && (
                                    <p className={`mt-4 text-center font-semibold ${message1.includes('Lỗi:') ? 'text-red-500' : 'text-green-600'}`}>
                                        {message1}
                                    </p>
                                )}

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleChangePassword}
                                        type="submit"
                                        disabled={loading}
                                        className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden">
                                        {loading ?
                                            'Đang cập nhật mật khẩu...' : 'Cập nhật mật khẩu'}

                                        <span
                                            className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"
                                        ></span>

                                        <span
                                            className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"
                                        ></span>
                                        <span
                                            className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"
                                        ></span>
                                        <span
                                            className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"
                                        ></span>
                                        <span
                                            className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    )}
                    {activeTab === 'nhanvien' && (isDirector || roles1.includes('TheaterManager')) && (
                        <StaffManagement cinemas={cinemas} />
                    )}

                    {activeTab === "theloai" && (isDirector || roles1.includes('MovieManager')) && (
                    <GenreManagement />
                    )}
                    {activeTab === "binhluan" && (isDirector || roles1.includes('MovieManager')) && (
                        <div className="min-h-screen bg-gradient-to-b from-gray-700/70 to-gray-500/50 font-sans py-10 px-4 rounded-2xl">
                            <div className="max-w-6xl mx-auto">
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                                    <h2 className="text-3xl font-bold text-yellow-400 mb-6 tracking-wide">Quản Lý Bình Luận</h2>
                                    <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-gray-500">
                                        <p className="text-gray-300 text-lg mb-2">Tính năng đang được phát triển</p>
                                        <p className="text-gray-400 text-sm">Giao diện duyệt, ẩn và xóa bình luận vi phạm của người dùng sẽ hiển thị tại đây.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "schedule" && (
                        <div>
                            <SCHEDULE />
                        </div>
                    )}
                    {activeTab === "doanhthu" && isDirector && (
                        <div>
                            <RevenueList />
                        </div>
                    )}
                    {activeTab === "xacdinhdichvu" && (isDirector || roles1.includes('Cashier')) && (
                        <div className="p-4 max-w-4xl rounded-xl mx-auto bg-gradient-to-b from-gray-700/70 to-gray-500/50">
                            {/* Error Message */}
                            {errorFood && (
                                <div className="bg-red-600/10 text-red-400 p-4 mb-4 rounded-md border border-red-500/30">
                                    {errorFood}
                                </div>
                            )}

                            {/* Order Form */}
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-yellow-500/30">
                                <h2 className="text-2xl font-bold text-white mb-6">Đặt Hàng Mới</h2>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Khách Hàng</label>
                                    <input
                                        type="text"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="Nhập email khách hàng"
                                        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Ngày Đặt Hàng</label>
                                    <input
                                        type="text"
                                        value={new Date().toLocaleDateString()}
                                        disabled
                                        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Chọn Món</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            value={selectedFoodId}
                                            onChange={(e) => setSelectedFoodId(e.target.value)}
                                        >
                                            <option value="">Chọn món</option>
                                            {Array.isArray(foodItems) && foodItems.length > 0 ? (
                                                foodItems.map((item) => (
                                                    <option key={item.foodId} value={item.foodId}>{item.foodName}</option>
                                                ))
                                            ) : (
                                                <option disabled>Không có món nào</option>
                                            )}
                                        </select>
                                        <select
                                            className="w-24 p-2 border rounded-md"
                                            value={quanlity}
                                            onChange={(e) => setquanlity(Number(e.target.value))}
                                        >
                                            {[1, 2, 3, 4].map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                                            onClick={handleAddItem}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Items List */}
                                {orderItems.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-white mb-2">Danh Sách Món Đã Chọn</h3>
                                        <ul className="list-disc pl-5 text-white bg-white/10 rounded-md p-4">
                                            {orderItems.map((item, index) => {
                                                const food = foodItems.find(f => f.foodId === item.productId);
                                                return (
                                                    <li key={index} className="flex items-center gap-2">
                                                        {food?.foodName || 'Unknown Item'} - quanlity: {item.quanlity}
                                                        <button
                                                            className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition"
                                                            onClick={() => handleDeleteStaffOrder(index)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <button
                                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                                        onClick={() => {
                                            setOrderItems([]);
                                            setCustomerEmail('');
                                        }}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSubmitOrder}
                                        disabled={orderItems.length === 0}
                                    >
                                        Gửi Đơn Hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'csphongrap' && (isDirector || roles1.includes('FacilitiesManager')) && (
                    <CinemaManagement cinemas={cinemas} fetchCinemas={fetchCinemas} />
                )}
                </div>
            </div>
            <div className="flex justify-center mt-10">
                <button className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
                    <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                        <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                        </svg>
                    </div>
                    <div onClick={handleLogout} className="absolute right-3 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">Đăng xuất</div>
                </button>
            </div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border cursor-pointer">↑</button>
            <div className="sticky mx-auto mt-28"><Bottom /></div>
        </div>

    );
};

export default Info;