import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from '../config/constants';

interface Cinema {
    cinemaId: string;
    cinemaName: string;
    cinemaLocation: string;
}

interface Role {
    roleName: string;
    roleid: string;
}

interface Staff {
    staffId: string;
    staffName: string;
    staffPhoneNumber: string;
    dayOfBirth: string;
    cinemaName: string;
    cinemaId: string;
    staffRole: string;
}

interface AddStaffFormData {
    staffId: string;
    cinemaId: string;
    loginUserEmail: string;
    loginUserPassword: string;
    loginUserPasswordConfirm: string;
    staffName: string;
    dateOfBirth: string;
    phoneNumer: string;
    role: string;
}

interface EditingStaff {
    staffId: string;
    staffName: string;
    dateOfBirth: string;
    phoneNumer: string;
    cinemaId: string;
    staffRole: string;
}

interface StaffManagementProps {
    cinemas: Cinema[];
}

const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toISOString() : "";

const StaffManagement: React.FC<StaffManagementProps> = ({ cinemas }) => {
    const navigate = useNavigate();
    const [addStaffFormData, setAddStaffFormData] = useState<AddStaffFormData>({
        staffId: "",
        cinemaId: "",
        loginUserEmail: "",
        loginUserPassword: "",
        loginUserPasswordConfirm: "",
        staffName: "",
        dateOfBirth: "",
        phoneNumer: "",
        role: "",
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [editingStaff, setEditingStaff] = useState<EditingStaff | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

    // Cập nhật Cinema mặc định khi danh sách Rạp được tải xong từ Component cha
    useEffect(() => {
        if (cinemas.length > 0 && !addStaffFormData.cinemaId) {
            setAddStaffFormData(prev => ({ ...prev, cinemaId: cinemas[0].cinemaId }));
        }
    }, [cinemas, addStaffFormData.cinemaId]);

    // Lấy danh sách Roles
    useEffect(() => {
        const fetchRoles = async () => {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/');
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/Staff/GetRoleList`, {
                    method: 'GET',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                if (data.status === "Success" && data.data) {
                    const fetchedRoles: Role[] = data.data;
                    setRoles(fetchedRoles);
                    if (fetchedRoles.length > 0) {
                        const cashierRole = fetchedRoles.find((role: Role) => role.roleName === "Cashier");
                        setAddStaffFormData(prev => ({ ...prev, role: cashierRole ? cashierRole.roleid : fetchedRoles[0].roleid }));
                    }
                }
            } catch (error: any) {
                console.error("Lỗi khi tải danh sách vai trò:", error.message);
            }
        };
        fetchRoles();
    }, [navigate]);

    // Lấy danh sách Staff
    const fetchStaffList = useCallback(async () => {
        try {
            setIsInitialLoading(true);
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/api/Staff/GetStaffList`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.status === "Success" && data.data) {
                const formattedStaffList = data.data.map((staff: any) => ({
                    ...staff,
                    dayOfBirth: formatDate(staff.dayOfBirth),
                }));
                setStaffList(formattedStaffList);
                setError(null);
            } else {
                setError("Không thể tải danh sách nhân viên.");
            }
        } catch (error) {
            setError("Lỗi khi tải danh sách nhân viên. Vui lòng thử lại.");
        } finally {
            setIsInitialLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (staffList.length === 0) fetchStaffList();
    }, [fetchStaffList, staffList.length]);

    const handleAddStaffInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof AddStaffFormData): void => {
        setAddStaffFormData({ ...addStaffFormData, [field]: e.target.value });
    };

    const handleAddStaffSubmit = async () => {
        if (!addStaffFormData.loginUserEmail || !addStaffFormData.loginUserPassword || !addStaffFormData.loginUserPasswordConfirm ||
            !addStaffFormData.staffName || !addStaffFormData.dateOfBirth || !addStaffFormData.phoneNumer ||
            !addStaffFormData.cinemaId) {
            toast.warning("Vui lòng điền đầy đủ tất cả thông tin.");
            return;
        }
        if (addStaffFormData.loginUserPassword !== addStaffFormData.loginUserPasswordConfirm) {
            toast.warning("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        setLoading(true);
        try {
            const dateOfBirthISO = addStaffFormData.dateOfBirth ? new Date(addStaffFormData.dateOfBirth).toISOString() : "";
            const authToken = localStorage.getItem('authToken');
            
            const response = await fetch(`${API_BASE_URL}/api/Staff/AddStaff`, {
                method: "POST",
                headers: { "accept": "*/*", "Content-Type": "application/json", 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({
                    loginUserEmail: addStaffFormData.loginUserEmail,
                    loginUserPassword: addStaffFormData.loginUserPassword,
                    loginUserPasswordConfirm: addStaffFormData.loginUserPasswordConfirm,
                    staffName: addStaffFormData.staffName,
                    dateOfBirth: dateOfBirthISO,
                    phoneNumer: addStaffFormData.phoneNumer,
                    cinemaId: addStaffFormData.cinemaId,
                    roleID: [addStaffFormData.role || "1a8f7b9c-d4e5-4f6a-b7c8-9d0e1f2a3b4c"]
                }),
            });

            if (!response.ok) throw new Error((await response.json()).message || `Lỗi HTTP: ${response.status}`);
            const result = await response.json();
            if (result.status === "Success") {
                toast.success("Thêm nhân viên thành công!");
                await fetchStaffList();
                setAddStaffFormData({
                    staffId: "",
                    cinemaId: cinemas.length > 0 ? cinemas[0].cinemaId : "",
                    loginUserEmail: "",
                    loginUserPassword: "",
                    loginUserPasswordConfirm: "",
                    staffName: "",
                    dateOfBirth: "",
                    phoneNumer: "",
                    role: roles.length > 0 ? roles[0].roleid : "Cashier",
                });
            } else toast.error(`Lỗi: ${result.message}`);
        } catch (error: any) {
            toast.error(`Lỗi khi thêm nhân viên: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (staffIdToDelete: string): Promise<void> => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Staff/DeleteStaff?id=${staffIdToDelete}`, {
                method: "DELETE",
                headers: { 'accept': "*/*", 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                toast.success("Xóa nhân viên thành công!");
                await fetchStaffList();
            } else throw new Error((await response.json()).message || `Lỗi HTTP: ${response.status}`);
        } catch (error: any) {
            toast.error(`Lỗi khi xóa nhân viên: ${error.message}`);
        } finally {
            setLoading(false);
            setStaffToDelete(null);
        }
    };

    const handleEdit = (staffIdToEdit: string): void => {
        const staffToEdit = staffList.find((staff) => staff.staffId === staffIdToEdit);
        if (staffToEdit) {
            setEditingStaff({
                staffId: staffToEdit.staffId,
                staffName: staffToEdit.staffName,
                dateOfBirth: staffToEdit.dayOfBirth,
                phoneNumer: staffToEdit.staffPhoneNumber,
                cinemaId: staffToEdit.cinemaId,
                staffRole: staffToEdit.staffRole || "",
            });
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Omit<EditingStaff, "staffId">): void => {
        if (editingStaff) setEditingStaff({ ...editingStaff, [field]: e.target.value });
    };

    const handleSaveEdit = async () => {
        if (!editingStaff) return;
        setLoading(true);
        try {
            const dateOfBirthISO = editingStaff.dateOfBirth ? new Date(editingStaff.dateOfBirth).toISOString() : "";
            const payload = {
                staffId: editingStaff.staffId,
                staffName: editingStaff.staffName,
                staffPhoneNumber: editingStaff.phoneNumer,
                dateOfBirth: dateOfBirthISO,
                cinemaId: editingStaff.cinemaId,
                staffRole: editingStaff.staffRole,
            };
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/Staff/editStaff?id=${editingStaff.staffId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                toast.success(`Cập nhật nhân viên ${editingStaff.staffName} thành công!`);
                await fetchStaffList();
                setEditingStaff(null);
            } else throw new Error((await response.json()).message || `Lỗi HTTP: ${response.status}`);
        } catch (error: any) {
            toast.error(`Lỗi khi cập nhật: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-700/70 to-gray-500/50 font-sans py-10 px-4 rounded-2xl">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-6 tracking-wide">Thêm Nhân Viên</h2>
                    {/* ... (Các Input của Thêm nhân viên) ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white italic">Thông tin đăng nhập</h3>
                            <select value={addStaffFormData.cinemaId} onChange={(e) => handleAddStaffInputChange(e, 'cinemaId')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2">
                                <option value="" disabled>-- Chọn rạp --</option>
                                {cinemas.map((cinema) => <option key={cinema.cinemaId} value={cinema.cinemaId}>{cinema.cinemaName}</option>)}
                            </select>
                            <input type="email" value={addStaffFormData.loginUserEmail} onChange={(e) => handleAddStaffInputChange(e, 'loginUserEmail')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" placeholder="Email Đăng nhập" />
                            <input type="password" value={addStaffFormData.loginUserPassword} onChange={(e) => handleAddStaffInputChange(e, 'loginUserPassword')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" placeholder="Mật khẩu" />
                            <input type="password" value={addStaffFormData.loginUserPasswordConfirm} onChange={(e) => handleAddStaffInputChange(e, 'loginUserPasswordConfirm')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" placeholder="Xác nhận mật khẩu" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white italic">Thông tin cá nhân</h3>
                            <input type="text" value={addStaffFormData.staffName} onChange={(e) => handleAddStaffInputChange(e, 'staffName')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" placeholder="Tên nhân viên" />
                            <input type="date" value={addStaffFormData.dateOfBirth} onChange={(e) => handleAddStaffInputChange(e, 'dateOfBirth')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" />
                            <input type="tel" value={addStaffFormData.phoneNumer} onChange={(e) => handleAddStaffInputChange(e, 'phoneNumer')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" placeholder="Số điện thoại" />
                            <select value={addStaffFormData.role} onChange={(e) => handleAddStaffInputChange(e, 'role')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2">
                                <option value="" disabled>-- Chọn quyền hạn --</option>
                                {roles.map((role) => <option key={role.roleid} value={role.roleid}>{role.roleName}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <button onClick={handleAddStaffSubmit} disabled={loading} className="bg-yellow-950 text-yellow-400 border border-yellow-400 rounded-md px-6 py-2">
                            {loading ? "Đang lưu..." : "Thêm nhân viên"}
                        </button>
                    </div>

                    {/* Danh sách nhân viên */}
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6 tracking-wide">Danh Sách Nhân Viên</h2>
                        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                        {successMessage && <p className="text-green-400 mb-4 text-center">{successMessage}</p>}
                        {isInitialLoading ? (
                            <p className="text-white text-center">Đang tải...</p>
                        ) : staffList.length === 0 ? (
                            <p className="text-white text-center">Không có nhân viên nào.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full bg-white/10 rounded-lg shadow-md">
                                    <thead>
                                        <tr className="bg-yellow-950 text-white">
                                            <th className="px-4 py-3 text-left">Tên</th>
                                            <th className="px-4 py-3 text-left">Ngày sinh</th>
                                            <th className="px-4 py-3 text-left">SĐT</th>
                                            <th className="px-4 py-3 text-left">Rạp</th>
                                            <th className="px-4 py-3 text-left">Tùy Chọn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staffList.map((staff) => (
                                            <tr key={staff.staffId} className="border-t border-gray-600 hover:bg-gray-700/20 text-white">
                                                <td className="px-4 py-2">{staff.staffName}</td>
                                                <td className="px-4 py-2">{staff.dayOfBirth}</td>
                                                <td className="px-4 py-2">{staff.staffPhoneNumber}</td>
                                                <td className="px-4 py-2">{cinemas.find((cinema) => cinema.cinemaId === staff.cinemaId)?.cinemaName || staff.cinemaId}</td>
                                                <td className="px-4 py-2 flex gap-2">
                                                    <button onClick={() => handleEdit(staff.staffId)} className="bg-blue-600 px-3 py-1 rounded-md">Sửa</button>
                                                    <button onClick={() => setStaffToDelete(staff.staffId)} className="bg-red-600 px-3 py-1 rounded-md">Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                    {/* Chỉnh sửa nhân viên */}
                    {editingStaff && (
                        <div className="mt-6 bg-white/10 p-6 rounded-2xl shadow-xl border border-yellow-500/30">
                            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Chỉnh sửa nhân viên</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" value={editingStaff.staffName} onChange={(e) => handleEditInputChange(e, 'staffName')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" />
                                <input type="date" value={editingStaff.dateOfBirth} onChange={(e) => handleEditInputChange(e, 'dateOfBirth')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" />
                                <input type="tel" value={editingStaff.phoneNumer} onChange={(e) => handleEditInputChange(e, 'phoneNumer')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2" />
                                <select value={editingStaff.cinemaId} onChange={(e) => handleEditInputChange(e, 'cinemaId')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2">
                                    {cinemas.map((cinema) => <option key={cinema.cinemaId} value={cinema.cinemaId}>{cinema.cinemaName}</option>)}
                                </select>
                                <select value={editingStaff.staffRole} onChange={(e) => handleEditInputChange(e, 'staffRole')} className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2">
                                    {roles.map((role) => <option key={role.roleid} value={role.roleid}>{role.roleName}</option>)}
                                </select>
                            </div>
                            <div className="mt-6 flex justify-center gap-4">
                                <button onClick={handleSaveEdit} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-md">Lưu</button>
                                <button onClick={() => setEditingStaff(null)} className="bg-gray-600 text-white px-6 py-2 rounded-md">Hủy</button>
                            </div>
                        </div>
                    )}

                    {/* Modal Xóa Nhân Viên */}
                    {staffToDelete && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
                                <h3 className="text-xl font-bold mb-4 text-black">Xác nhận xóa</h3>
                                <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.</p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                                        onClick={() => setStaffToDelete(null)}
                                        disabled={loading}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 transition"
                                        onClick={() => handleDelete(staffToDelete)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;