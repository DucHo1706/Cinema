import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Header/nav';
import Bottom from '../Footer/bottom';

// Define interfaces for payment data
interface FoodRequestDTO {
    foodID: string;
    quantity: number;
    foodName?: string;
    foodPrice?: number;
}

interface SeatRequestDTO {
    seatID: string;
    seatsNumber?: string;
}

interface UserTypeRequestDTO {
    userTypeID: string;
    quantity: number;
    seatsList: SeatRequestDTO[];
    userTypeName?: string;
    price?: number;
}

interface BookingDetails {
    userId: string;
    movieScheduleId: string;
    foodRequestDTOs: FoodRequestDTO[];
    userTypeRequestDTO: UserTypeRequestDTO[];
    movieName?: string;
    cinemaName?: string;
    showTime?: string;
    showDate?: string;
    roomNumber?: number;
    totalPrice?: number;
}

const Payment: React.FC = () => {
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
    const navigate = useNavigate();

    const handlelistfilm = () => {
        navigate('/listfilm')
    }

    useEffect(() => {
        // Retrieve booking details from localStorage
        const storedBooking = localStorage.getItem('bookingDetails');
        if (storedBooking) {
            setBookingDetails(JSON.parse(storedBooking));
        } else {
            setError('Không tìm thấy thông tin đặt vé.');
        }
        setLoading(false);
    }, []);

    const handleConfirmPayment = async () => {
        if (!bookingDetails) {
            setError('Không có thông tin đặt vé để xử lý thanh toán.');
            return;
        }

        setPaymentProcessing(true);
        setError(null);

        var respondInfoBookingString = localStorage.getItem("respondInfoBooking");

        if (respondInfoBookingString) {
            try {
                // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
                const respondInfoBooking = JSON.parse(respondInfoBookingString);

                // Bây giờ bạn có thể truy cập thuộc tính 'data'
                const vnpayURL = respondInfoBooking.data.vnpayInfo.VnpayURL;

                window.location.href = vnpayURL

                // ... Các logic khác để hiển thị modal của bạn ...

            } catch (e) {
                console.error("Lỗi khi phân tích cú pháp JSON từ localStorage:", e);
            }
        } else {
            console.log("Không tìm thấy 'respondInfoBooking' trong localStorage.");
        }
    };

    const calculateTotalPrice = () => {
        if (!bookingDetails) return 0;

        let total = 0;
        // Calculate ticket price
        bookingDetails.userTypeRequestDTO.forEach(type => {
            if (type.price) {
                total += type.quantity * type.price;
            }
        });
        // Calculate food price
        bookingDetails.foodRequestDTOs.forEach(food => {
            if (food.foodPrice) {
                total += food.quantity * food.foodPrice;
            }
        });
        return total;
    };

    return (
        <div className="relative min-h-screen w-full font-sans selection:bg-purple-500/30 text-slate-200">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="sticky top-0 z-50 bg-slate-950 shadow-md border-b border-slate-800/50">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                        <Nav />
                    </div>
                </div>
                <main className="flex-grow flex flex-col items-center">
                    <div className="flex-1 max-w-3xl w-full px-4 pt-12 pb-6">
                        {loading && (
                            <div className="flex-col gap-4 w-full flex items-center justify-center">
                                <div className="w-20 h-20 border-4 border-transparent text-purple-500 text-4xl animate-spin flex items-center justify-center border-t-purple-500 rounded-full">
                                    <div className="w-16 h-16 border-4 border-transparent text-indigo-500 text-2xl animate-spin flex items-center justify-center border-t-indigo-500 rounded-full"></div>
                                </div>
                                <p className="text-slate-400 font-medium mt-4 tracking-wider animate-pulse">Đang tải thông tin...</p>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center font-medium mt-8">{error}</div>
                        )}
                        {bookingDetails && (
                            <div className="w-full">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-10 text-center uppercase tracking-wider">Xác nhận thanh toán</h1>
                                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
                                    <h2 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4 text-slate-200">Thông tin đặt vé</h2>
                                    <div className="space-y-4 text-slate-300">
                                        <p className="flex items-start"><span className="font-bold text-purple-400 w-32 shrink-0">Phim:</span> <span>{bookingDetails.movieName}</span></p>
                                        <p className="flex items-start"><span className="font-bold text-purple-400 w-32 shrink-0">Rạp:</span> <span>{bookingDetails.cinemaName}</span></p>
                                        <p className="flex items-start"><span className="font-bold text-purple-400 w-32 shrink-0">Suất chiếu:</span> <span>{bookingDetails.showTime} - {new Date(bookingDetails.showDate || '').toLocaleDateString('vi-VN')}</span></p>
                                        <p className="flex items-start"><span className="font-bold text-purple-400 w-32 shrink-0">Phòng chiếu:</span> <span>{bookingDetails.roomNumber}</span></p>

                                        <h3 className="font-bold text-lg mt-8 mb-3 text-slate-200 border-t border-slate-800 pt-6">Vé đã chọn</h3>
                                        {bookingDetails.userTypeRequestDTO.map((type, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span>{type.userTypeName} x {type.quantity} (Ghế: {type.seatsList.map(seat => seat.seatsNumber).join(', ')})</span>
                                                <span className="font-semibold text-emerald-400">{(type.quantity * (type.price || 0)).toLocaleString('vi-VN')} VNĐ</span>
                                            </div>
                                        ))}

                                        <h3 className="font-bold text-lg mt-8 mb-3 text-slate-200 border-t border-slate-800 pt-6">Đồ ăn & thức uống</h3>
                                        {bookingDetails.foodRequestDTOs.length > 0 ? (
                                            bookingDetails.foodRequestDTOs.map((food, index) => (
                                                food.quantity > 0 && (
                                                    <div key={index} className="flex justify-between">
                                                        <span>{food.foodName} x {food.quantity}</span>
                                                        <span className="font-semibold text-emerald-400">{(food.quantity * (food.foodPrice || 0)).toLocaleString('vi-VN')} VNĐ</span>
                                                    </div>
                                                )
                                            ))
                                        ) : (
                                            <p className="text-slate-500 italic">Không có đồ ăn/thức uống được chọn</p>
                                        )}

                                        <div className="flex justify-between font-bold text-xl text-emerald-400 border-t border-slate-700 pt-6 mt-8">
                                            <span className="text-slate-200 uppercase tracking-wider">Tổng cộng:</span>
                                            <span>{calculateTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 max-w-md w-full px-4 pb-12">
                        <h2 className="text-xl font-bold mb-6 text-center text-slate-300 uppercase tracking-wider">Phương thức thanh toán</h2>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleConfirmPayment}
                                disabled={paymentProcessing}
                                className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <img src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg" alt="vnpay" className="h-6" />
                                Thanh toán qua VNPay
                            </button>
                            <button
                                onClick={handlelistfilm}
                                className="w-full py-3.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-all font-bold tracking-wide mt-2"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </main>
                <footer>
                    <Bottom />
                </footer>
            </div>
        </div>
    );
};

export default Payment;
