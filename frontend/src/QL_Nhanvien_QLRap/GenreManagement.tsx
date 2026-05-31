import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from '../config/constants';

interface Genre {
    id: string;
    name: string;
    description: string;
}

const GenreManagement: React.FC = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isGenresLoading, setIsGenresLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State dùng chung cho Modal Thêm/Sửa Thể Loại
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingGenreId, setEditingGenreId] = useState<string | null>(null);
    const [genreFormData, setGenreFormData] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    // State cho Modal Xóa
    const [genreToDelete, setGenreToDelete] = useState<string | null>(null);

    // Fetch danh sách thể loại
    const fetchGenres = useCallback(async () => {
        setIsGenresLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Genre`, {
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) throw new Error("Lỗi khi tải danh sách thể loại");
            const data = await response.json();
            const items = data.data || data; 
            if (Array.isArray(items)) {
                setGenres(items.map((item: any) => ({
                    id: item.id || item.genreId,
                    name: item.name || item.genreName,
                    description: item.description || ''
                })));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenresLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    // Mở Modal Thêm
    const handleOpenAddModal = () => {
        setModalMode('add');
        setEditingGenreId(null);
        setGenreFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    // Mở Modal Sửa
    const handleOpenEditModal = (genre: Genre) => {
        setModalMode('edit');
        setEditingGenreId(genre.id);
        setGenreFormData({ name: genre.name, description: genre.description || '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Logic API Dùng chung cho Thêm/Sửa
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!genreFormData.name.trim()) {
            toast.warning("Vui lòng nhập tên thể loại");
            return;
        }
        setIsSubmitting(true);
        try {
            const authToken = localStorage.getItem('authToken');
            
            let url = `${API_BASE_URL}/api/Genre`;
            let method = "POST";
            let payload: any = { name: genreFormData.name, description: genreFormData.description };

            // Tùy chỉnh URL và Method nếu đang ở chế độ Edit
            if (modalMode === 'edit' && editingGenreId) {
                url = `${API_BASE_URL}/api/Genre/${editingGenreId}`; 
                method = "PUT";
                payload = { id: editingGenreId, name: genreFormData.name, description: genreFormData.description };
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "accept": "*/*",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(payload) 
            });

            if (response.ok) {
                toast.success(modalMode === 'add' ? "Thêm thể loại thành công!" : "Cập nhật thể loại thành công!");
                handleCloseModal();
                fetchGenres();
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(`Lỗi: ${errorData.message || "Không thể lưu thể loại"}`);
            }
        } catch (err: any) {
            toast.error(`Lỗi: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Logic API Xóa
    const handleDelete = async (id: string) => {
        setIsSubmitting(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Genre/${id}`, {
                method: "DELETE",
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                toast.success("Xóa thể loại thành công!");
                fetchGenres();
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(`Lỗi: ${errorData.message || "Không thể xóa thể loại. Có thể do phim đang dùng thể loại này."}`);
            }
        } catch (err: any) {
            toast.error(`Lỗi: ${err.message}`);
        } finally {
            setIsSubmitting(false);
            setGenreToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-700/70 to-gray-500/50 font-sans py-10 px-4 rounded-2xl">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-yellow-400 tracking-wide">Quản Lý Thể Loại</h2>
                        <button 
                            onClick={handleOpenAddModal}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md font-bold transition">
                            + Thêm Thể Loại
                        </button>
                    </div>
                    {isGenresLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="flex flex-row gap-2">
                                <div className="w-4 h-4 rounded-full bg-yellow-300 animate-bounce"></div>
                                <div className="w-4 h-4 rounded-full bg-yellow-300 animate-bounce [animation-delay:-.3s]"></div>
                                <div className="w-4 h-4 rounded-full bg-yellow-300 animate-bounce [animation-delay:-.5s]"></div>
                            </div>
                        </div>
                    ) : error && genres.length === 0 ? (
                        <p className="text-red-400 text-center">{error}</p>
                    ) : genres.length === 0 ? (
                        <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-gray-500">
                            <p className="text-gray-300 text-lg mb-2">Chưa có thể loại nào.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white/10 rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-yellow-950 text-white">
                                        <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Tên Thể Loại</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Mô Tả</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold w-32">Tùy Chọn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genres.map((genre, index) => (
                                        <tr key={genre.id} className="border-t border-gray-600 hover:bg-gray-700/20 transition text-white">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 font-semibold text-yellow-300">{genre.name}</td>
                                            <td className="px-4 py-3">{genre.description || "Không có mô tả"}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleOpenEditModal(genre)}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">Sửa
                                                    </button>
                                                    <button 
                                                        onClick={() => setGenreToDelete(genre.id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition">Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal dùng chung cho Thêm và Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
                        <h3 className="text-xl font-bold mb-4">{modalMode === 'add' ? 'Thêm Thể Loại Mới' : 'Chỉnh Sửa Thể Loại'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên Thể Loại</label>
                                    <input
                                        type="text"
                                        value={genreFormData.name}
                                        onChange={(e) => setGenreFormData({ ...genreFormData, name: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                                        placeholder="Ví dụ: Hành động, Kinh dị..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
                                    <textarea
                                        value={genreFormData.description}
                                        onChange={(e) => setGenreFormData({ ...genreFormData, description: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                                        placeholder="Mô tả ngắn về thể loại này..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Modal Xác nhận Xóa */}
            {genreToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
                        <h3 className="text-xl font-bold mb-4 text-black">Xác nhận xóa</h3>
                        <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa thể loại này không?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                                onClick={() => setGenreToDelete(null)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition"
                                onClick={() => handleDelete(genreToDelete)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenreManagement;