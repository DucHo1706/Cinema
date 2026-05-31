// Cấu hình đường dẫn Backend API dùng chung cho toàn dự án
// Lấy từ biến môi trường, nếu không có thì mặc định dùng localhost
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5229';
