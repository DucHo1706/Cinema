import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Cinema {
    cinemaId: string;
    cinemaName: string;
    cinemaLocation: string;
    cinemaDescription?: string;
    cinemaContactNumber?: string;
}

interface CinemaManagementProps {
    cinemas: Cinema[];
    fetchCinemas: () => void;
}

const CinemaManagement: React.FC<CinemaManagementProps> = ({ cinemas, fetchCinemas }) => {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCinemaId, setSelectedCinemaId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newCinema, setNewCinema] = useState({
        cinemaName: '',
        cinemaLocation: '',
        cinemaDescription: '',
        cinemaContactNumber: '',
    });

    const handleCinemaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCinema((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveCinema = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5229/api/Cinema/addCinema', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(newCinema),
            });

            if (!response.ok) {
                throw new Error('Failed to add cinema');
            }

            setIsAddModalOpen(false);
            setNewCinema({
                cinemaName: '',
                cinemaLocation: '',
                cinemaDescription: '',
                cinemaContactNumber: '',
            });
            fetchCinemas();
            toast.success('Đã tạo rạp chiếu thành công!');
        } catch (err) {
            toast.error('Lỗi khi thêm rạp. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCinema = async () => {
        if (!selectedCinemaId) {
            toast.warning('Vui lòng chọn một rạp để xóa');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5229/api/Cinema/deleteCinema/${selectedCinemaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete cinema');
            }

            setIsDeleteModalOpen(false);
            setSelectedCinemaId('');
            fetchCinemas();
            toast.success('Đã xóa rạp thành công!');
        } catch (err) {
            toast.error('Lỗi khi xóa rạp. Có thể rạp đang được sử dụng hoặc có lịch chiếu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-700/70 to-gray-500/50 font-sans py-10 px-4 rounded-2xl">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-yellow-400 tracking-wide">Danh Sách Rạp</h2>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-bold transition"
                        >
                            + Thêm Rạp
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold transition"
                        >
                            - Xóa Rạp
                        </button>
                        <button
                            onClick={() => navigate('/QTVHThong/chinhsuaphongrap')}
                            className="relative bg-yellow-950 text-yellow-400 border border-yellow-400 rounded-md px-6 py-2 font-medium overflow-hidden transition-all duration-300 hover:bg-yellow-900 hover:border-yellow-500 group"
                        >
                            Quản lý phòng chiếu
                        </button>
                    </div>
                </div>

                {cinemas.length === 0 ? (
                    <p className="text-white text-center">Không có rạp nào để hiển thị.</p>
                ) : (
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cinemas.map((cinema) => (
                                <div
                                    key={cinema.cinemaId}
                                    className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-600 hover:border-yellow-500 transition-all duration-300"
                                >
                                    <h3 className="text-xl font-semibold text-yellow-400">{cinema.cinemaName}</h3>
                                    <p className="text-gray-300 mt-2">{cinema.cinemaLocation}</p>
                                    {cinema.cinemaDescription && (
                                        <p className="text-gray-400 mt-1">{cinema.cinemaDescription}</p>
                                    )}
                                    {cinema.cinemaContactNumber && (
                                        <p className="text-gray-400 mt-1">SĐT: {cinema.cinemaContactNumber}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Thêm Rạp */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-black">Thêm Rạp Mới</h3>
                        <div className="space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên Rạp</label>
                                <input
                                    type="text"
                                    name="cinemaName"
                                    value={newCinema.cinemaName}
                                    onChange={handleCinemaInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                                <input
                                    type="text"
                                    name="cinemaLocation"
                                    value={newCinema.cinemaLocation}
                                    onChange={handleCinemaInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    name="cinemaDescription"
                                    value={newCinema.cinemaDescription}
                                    onChange={handleCinemaInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="cinemaContactNumber"
                                    value={newCinema.cinemaContactNumber}
                                    onChange={handleCinemaInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setIsAddModalOpen(false)}
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                onClick={handleSaveCinema}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xóa Rạp */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
                        <h3 className="text-xl font-bold mb-4 text-black">Xóa Rạp</h3>
                        <div className="space-y-4 text-black">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chọn Rạp</label>
                                <select
                                    value={selectedCinemaId}
                                    onChange={(e) => setSelectedCinemaId(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">--Chọn rạp để xóa--</option>
                                    {cinemas.map((cinema) => (
                                        <option key={cinema.cinemaId} value={cinema.cinemaId}>
                                            {cinema.cinemaName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSelectedCinemaId('');
                                }}
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                onClick={handleDeleteCinema}
                                disabled={!selectedCinemaId || isLoading}
                            >
                                {isLoading ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CinemaManagement;