import React, { useState, useEffect } from 'react';

interface Cinema {
  cinemaId: string;
  cinemaName: string;
  cinemaLocation: string;
  cinemaDescription: string;
  cinemaContactNumber: string;
}

interface Revenue {
  baseCinemaInfoRevenue: {
    cinemaId: string;
    cinemaName: string;
  };
  totalRevenue: number;
}

// Cập nhật interface để phù hợp với cấu trúc response chi tiết
interface DetailedRevenueData {
  baseCinemaInfoRevenue: {
    cinemaId: string;
    cinemaName: string;
  };
  baseRevenueInfo: {
    date: string;
    totalAmount: number;
  }[];
  totalRevenue: number;
}
const RevenueList: React.FC = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // State mới để quản lý modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [detailedRevenue, setDetailedRevenue] = useState<DetailedRevenueData | null>(null);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5229/api/Revenue/GetAllRevenue', {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response (Revenue):', data);

      if (Array.isArray(data.data)) {
        setRevenues(data.data);
        setError(null);
      } else {
        throw new Error('Dữ liệu trả về không phải là mảng hoặc không chứa mảng trong thuộc tính "data"');
      }
    } catch (err) {
      setError('Lỗi khi lấy dữ liệu doanh thu: ' + (err as Error).message);
      setRevenues([]);
    }
  };

  const fetchCinemas = async () => {
    try {
      const response = await fetch('http://localhost:5229/api/Cinema/getCinemaList', {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response (Cinema):', data);

      if (Array.isArray(data.data)) {
        setCinemas(data.data);
        setError(null);
      } else {
        throw new Error('Dữ liệu trả về không phải là mảng hoặc không chứa mảng trong thuộc tính "data"');
      }
    } catch (err) {
      setError('Lỗi khi lấy danh sách rạp: ' + (err as Error).message);
    }
  };

  const fetchRevenueDetail = async (cinemaId: string) => {
    try {
      console.log('Fetching revenue for cinemaId:', cinemaId);

      const response = await fetch(`http://localhost:5229/api/Revenue/GetRevenueByCinemaId?cinemaId=${cinemaId}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // LOG TOÀN BỘ PHẢN HỒI CỦA API
      console.log('API Response (Detail):', data);

      if (data.data) {
        setDetailedRevenue(data.data);
        setIsDetailModalOpen(true);
      } else {
        throw new Error('Dữ liệu chi tiết không hợp lệ');
      }
    } catch (err) {
      setError('Lỗi khi lấy chi tiết doanh thu: ' + (err as Error).message);
    }
  };

  const closeModal = () => {
    setIsDetailModalOpen(false);
    setDetailedRevenue(null);
  };

  useEffect(() => {
    fetchRevenue();
    fetchCinemas();
  }, []);

  const filteredRevenues = selectedCinemaId
    ? revenues.filter(revenue => revenue.baseCinemaInfoRevenue.cinemaId === selectedCinemaId)
    : revenues;

  return (
    <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 tracking-wide uppercase">Doanh Thu Rạp</h1>
        <button className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transition-all" onClick={fetchRevenue}>Làm Mới Dữ Liệu 🔄</button>
      </div>

      {/* Áp dụng CSS cho dropdown */}
      <div className="mb-8 w-full md:w-72">
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Lọc theo rạp:</label>
        <select
          className="w-full bg-slate-950/50 text-white border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
          value={selectedCinemaId || ''}
          onChange={(e) => setSelectedCinemaId(e.target.value || null)}
        >
          <option value="">Tất cả các rạp</option>
          {Array.isArray(cinemas) && cinemas.map((cinema) => (
            <option key={cinema.cinemaId} value={cinema.cinemaId}>
              {cinema.cinemaName}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 p-4 mb-6 rounded-xl border border-red-500/30">{error}</div>}

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/80">
            <tr>
              <th className="p-4 text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-700">Mã rạp</th>
              <th className="p-4 text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-700">
                Tên rạp
              </th>
              <th className="p-4 text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-700">
                Doanh thu
              </th>
              <th className="p-4 text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-700">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 bg-slate-950/30">
            {Array.isArray(filteredRevenues) && filteredRevenues.length > 0 ? (
              filteredRevenues.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-slate-300 font-medium">{item.baseCinemaInfoRevenue.cinemaId ?? 'N/A'}</td>
                  <td className="p-4 text-slate-300 font-bold">{item.baseCinemaInfoRevenue.cinemaName ?? 'N/A'}</td>
                  <td className="p-4 text-emerald-400 font-bold">{item.totalRevenue ? item.totalRevenue.toLocaleString() + ' VNĐ' : 'N/A'}</td>
                  <td className="p-4">
                    <button className="px-4 py-1.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-bold transition-colors" onClick={() => fetchRevenueDetail(item.baseCinemaInfoRevenue.cinemaId)}>Xem Chi tiết</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Không có dữ liệu doanh thu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal hiển thị chi tiết doanh thu */}
      {isDetailModalOpen && detailedRevenue && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative animate-fade-in-up">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-red-600 p-2 rounded-full transition-colors" onClick={closeModal}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 pr-8">Chi tiết doanh thu: <span className="text-amber-400">{detailedRevenue.baseCinemaInfoRevenue.cinemaName}</span></h2>
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-sm">Mã rạp: <br /><strong className="text-slate-200 text-base">{detailedRevenue.baseCinemaInfoRevenue.cinemaId}</strong></p>
              <p className="text-slate-400 text-sm">Tổng doanh thu: <br /><strong className="text-emerald-400 text-xl">{detailedRevenue.totalRevenue.toLocaleString()} VNĐ</strong></p>
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider text-sm">Biến động theo ngày</h3>
            <div className="max-h-60 overflow-y-auto pr-2 rounded-xl border border-slate-800 bg-slate-950/30">
              {detailedRevenue.baseRevenueInfo.length > 0 ? (
                <ul className="divide-y divide-slate-800/50">
                  {detailedRevenue.baseRevenueInfo.map((item, index) => (
                    <li key={index} className="flex justify-between p-4 hover:bg-slate-800/30 transition-colors">
                      <span className="text-slate-300">{new Date(item.date).toLocaleDateString('vi-VN')}</span>
                      <strong className="text-emerald-400">{item.totalAmount.toLocaleString()} đ</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-center text-slate-500">Không có dữ liệu doanh thu theo ngày.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueList;