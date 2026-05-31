# QUY CHUẨN KIẾN TRÚC VÀ VIẾT CODE DỰ ÁN (CODING & ARCHITECTURE GUIDELINES)

Đây là bộ quy tắc bắt buộc áp dụng cho toàn bộ dự án nhằm đảm bảo mã nguồn dễ đọc, dễ hiểu và dễ bảo trì.

## 1. Kiến trúc phân tầng (Thin Controller - Fat Service)
- **Controller**: Tuyệt đối KHÔNG chứa logic nghiệp vụ (business logic) hoặc gọi trực tiếp Database (`DataContext`). Controller chỉ làm 3 nhiệm vụ:
  1. Nhận Request từ Client (thông qua DTO).
  2. Gọi phương thức tương ứng từ Service (đã được Inject).
  3. Trả về Response chuẩn hóa kèm HTTP Status Code (200, 400, 404, 500...).
- **Service**: Là "trái tim" của hệ thống. Chứa 100% logic xử lý nghiệp vụ, kiểm tra điều kiện (validation) và giao tiếp với Database thông qua Entity Framework Core.

## 2. Loại bỏ hoàn toàn Hardcode (No Hardcoding)
- **Chuỗi kết nối, Secret Key, Cấu hình API bên thứ 3**: KHÔNG viết cứng trong code. Phải đưa vào file `appsettings.json` và đọc ra bằng `IConfiguration`.
- **Trạng thái, Role, Phân loại**: KHÔNG viết cứng các chuỗi rải rác (như `"Pending"`, `"Success"`, `"Director"`).
  - *Cách xử lý:* Phải tạo các `Enum` hoặc một thư mục `Constants` chứa các biến `public const string`. 
  - *Ví dụ:* Thay vì `if (role == "Cashier")` hãy dùng `if (role == RoleConstants.Cashier)`.

## 3. Sử dụng Data Transfer Object (DTO Pattern)
- **Tuyệt đối không phơi bày (expose) Model/Entity trực tiếp ra API.**
- Sử dụng các class DTO (`RequestDTO`, `ResponseDTO`) để hứng dữ liệu từ Client và trả dữ liệu về. Điều này giúp bảo mật thông tin (không lộ ID tự tăng, dữ liệu nhạy cảm) và dễ kiểm soát các trường bắt buộc (`[Required]`).

## 4. Quản lý Dependency Injection (DI)
- KHÔNG khởi tạo class Service bằng từ khóa `new` bên trong Controller/Service khác.
- Tất cả các Service phải được thiết kế đi kèm Interface (Ví dụ: `IMovieService` và `MovieService`).
- Phải đăng ký DI tại `Program.cs` (`builder.Services.AddScoped<IMovieService, MovieService>();`) và lấy ra thông qua Constructor (Constructor Injection).

## 5. Chuẩn hóa kết quả trả về (Standardized Response)
- Mọi API trả về cho Frontend phải tuân thủ một format JSON duy nhất để Frontend dễ dùng Interceptor cấu hình:
  ```json
  {
      "status": "Success", // Hoặc "Error"
      "message": "Mô tả kết quả hành động",
      "data": { ... } // Payload dữ liệu thực tế (Object, Array hoặc null)
  }
  ```
- Các hàm trong Service nên trả về cấu trúc Tuple `(bool IsSuccess, string Message, object? Data)` hoặc tạo class `ServiceResponse<T>`.

## 6. Truy vấn Database hiệu quả (Entity Framework Core)
- Ưu tiên dùng `.FirstOrDefaultAsync()` hoặc `.FindAsync(id)`.
- **Tránh N+1 Query:** Không thực hiện vòng lặp gọi Database bên trong một vòng lặp khác. Phải query sẵn một cục List hoặc dùng `.Include()` nếu cần lấy bảng liên kết.
- Không được gọi lệnh `.Update()` nếu entity đã được Track bởi EF Core (chỉ cần đổi giá trị thuộc tính, sau đó gọi `.SaveChangesAsync()`).

## 7. Quy tắc Đặt tên (Naming Conventions)
- **Class, Method, Property**: Viết hoa chữ cái đầu (PascalCase) - VD: `CreateMovieAsync`, `UserId`.
- **Interface**: Bắt buộc bắt đầu bằng chữ `I` - VD: `IUserService`.
- **Biến cục bộ, Tham số**: Viết thường chữ cái đầu (camelCase) - VD: `movieName`, `requestDTO`.
- **Biến DI (Private Readonly)**: Bắt buộc bắt đầu bằng dấu gạch dưới - VD: `_context`, `_cloudinaryService`.
- Các hàm bất đồng bộ bắt buộc phải có hậu tố `Async` ở cuối tên (VD: `GetListAsync`).

## 8. Hạn chế sử dụng Cú pháp viết tắt không rõ ràng
- **Toán tử ba ngôi (`? :`)**: Chỉ dùng cho việc gán biến đơn giản. Nếu logic điều kiện phức tạp, bắt buộc dùng `if-else` tường minh.
- Không dùng các vòng lặp lồng nhau hoặc LINQ quá phức tạp trong 1 dòng. Hãy tách thành các biến trung gian để sau này dễ Debug.