import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Header/nav";
import Bottom from "../Footer/bottom";
import bg from "../image/bg.png";
import { Navigate, useNavigate } from "react-router";
import { API_BASE_URL } from '../config/constants';

// Interfaces
interface Genre {
    genreId: string;
    genreName: string;
}

interface Movie {
    movieId?: string;
    name: string;
    image: string | null;
    description?: string;
    director?: string;
    cast?: string;
    trailer: string;
    duration: number;
    ageLimit?: string;
    language: string;
    releaseDate: string;
    genres: string[];
}

interface ErrorResponse {
    thongTinLoi?: {
        status: string;
        message: string;
    };
    errors?: string | string[];
}

interface CreateMovieResponse {
    movieID?: string;
    movieImage?: string;
    message?: string;
}

interface FormState {
    name: string;
    description: string;
    duration: string;
    actor: string;
    director: string;
    trailer: string;
    releaseDate: string;
    languageId: string;
    ageId: string;
}

const AddMovie: React.FC = () => {
    const [theloaiOptions, setTheloaiOptions] = useState<Genre[]>([]);

    // ĐÃ SỬA: Chuyển mảng string thành mảng Object để gửi mã ngắn gọn xuống Backend
    const [ageOptions] = useState<{ value: string, label: string }[]>([
        { value: 'P', label: 'P (Mọi lứa tuổi)' },
        { value: 'T13', label: 'T13 (Từ 13 tuổi trở lên)' },
        { value: 'T16', label: 'T16 (Từ 16 tuổi trở lên)' },
        { value: 'T18', label: 'T18 (Từ 18 tuổi trở lên)' },
        { value: 'K', label: 'K (Khác)' }
    ]);

    const [languageOptions] = useState<string[]>(['Tiếng Việt', 'Tiếng Anh (Phụ đề Việt)', 'Tiếng Hàn (Phụ đề Việt)', 'Tiếng Nhật (Phụ đề Việt)', 'Lồng Tiếng']);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [form, setForm] = useState<FormState>({
        name: "",
        description: "",
        duration: "",
        actor: "",
        director: "",
        trailer: "",
        releaseDate: "",
        languageId: "",
        ageId: "",
    });
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loi, setLoi] = useState("");
    const [thanhCong, setThanhCong] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const handleHome = () => {
        navigate('/HomeAdmin');
    }
    useEffect(() => {
        return () => {
            movies.forEach((movie) => {
                if (movie.image && movie.image.startsWith("blob:")) {
                    URL.revokeObjectURL(movie.image);
                }
            });
        };
    }, [movies]);

    const fetchData = async (url: string, setData: (data: any) => void, errorMessage: string) => {
        const currentToken = localStorage.getItem('authToken');
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(
                    `${errorMessage}: ${errorData.message || `HTTP ${res.status}`}`
                );
            }
            const data = await res.json();
            console.log(`${errorMessage.split(":")[0]}:`, data);
            setData(data);
        } catch (err: any) {
            console.error("Lỗi chi tiết:", err);
            setLoi(`${errorMessage}: ${err.message}`);
        } finally {
            if (url.includes("getAllMoviesPagniation")) {
                setLoading(false);
            }
        }
    };

    const fetchMovies = (page: number) => {
        fetchData(
            `${API_BASE_URL}/api/movie/getAllMoviesPagniation/${page}`,
            (data) => {
                const moviesData = data.movieRespondDTOs || data.data || data;
                const formattedMovies = (Array.isArray(moviesData) ? moviesData : []).map((item: any) => ({
                    movieId: item.movieID || item.movieId || undefined,
                    name: item.movieName || "Không có tên",
                    image: item.movieImage || null,
                    description: item.movieDescription || "Không có mô tả",
                    director: item.movieDirector || "Không có đạo diễn",
                    cast: item.movieActor || "Không có diễn viên",
                    trailer: item.movieTrailerUrl || item.trailerURL || "",
                    duration: item.movieDuration || 0,
                    ageLimit: item.ageRating || "",
                    language: item.language || "Không có ngôn ngữ",
                    releaseDate: item.releaseDate ? new Date(item.releaseDate).toLocaleDateString() : "Không có ngày",
                    genres: item.movieGenres || [],
                }));
                setMovies(formattedMovies);
                setTotalPages(Math.ceil((data.totalCount || 1) / (data.pageSize || 1)));
            },
            "Không thể tải danh sách phim"
        );
    };

    useEffect(() => {
        const currentToken = localStorage.getItem('authToken');
        if (!currentToken) {
            setLoi("Không tìm thấy token xác thực");
            setLoading(false);
            return;
        }

        fetchData(
            `${API_BASE_URL}/api/Genre`,
            (data) => {
                // Hỗ trợ cả object response.data hoặc array trực tiếp
                const items = data.data || data;
                if (Array.isArray(items)) {
                    setTheloaiOptions(items.map((item: any) => ({ genreId: item.id || item.genreId, genreName: item.name || item.genreName })));
                }
            },
            "Lưu ý: API thể loại có thể đã đổi sang /api/Genre"
        );

        fetchMovies(page);
    }, [page]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        if (selected && !selectedGenres.includes(selected)) {
            setSelectedGenres((prev) => [...prev, selected]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoi("");
        setThanhCong("");
        setIsSubmitting(true);

        // Validation logic
        if (!form.name) {
            setLoi("Vui lòng nhập tên phim");
            setIsSubmitting(false);
            return;
        }
        if (!form.description) {
            setLoi("Vui lòng nhập mô tả phim");
            setIsSubmitting(false);
            return;
        }
        if (!form.duration || isNaN(parseInt(form.duration)) || parseInt(form.duration) <= 0) {
            setLoi("Vui lòng nhập thời lượng hợp lệ (số phút lớn hơn 0)");
            setIsSubmitting(false);
            return;
        }
        if (!form.actor) {
            setLoi("Vui lòng nhập diễn viên");
            setIsSubmitting(false);
            return;
        }
        if (!form.director) {
            setLoi("Vui lòng nhập đạo diễn");
            setIsSubmitting(false);
            return;
        }
        if (!form.trailer) {
            setLoi("Vui lòng nhập URL trailer");
            setIsSubmitting(false);
            return;
        }
        const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        if (!urlPattern.test(form.trailer)) {
            setLoi("URL trailer không hợp lệ");
            setIsSubmitting(false);
            return;
        }
        if (!form.releaseDate) {
            setLoi("Vui lòng chọn ngày ra mắt");
            setIsSubmitting(false);
            return;
        }
        const parsedDate = new Date(form.releaseDate);
        if (isNaN(parsedDate.getTime())) {
            setLoi("Ngày ra mắt không hợp lệ");
            setIsSubmitting(false);
            return;
        }
        if (!form.languageId) {
            setLoi("Vui lòng chọn ngôn ngữ");
            setIsSubmitting(false);
            return;
        }
        if (!form.ageId) {
            setLoi("Vui lòng chọn độ tuổi");
            setIsSubmitting(false);
            return;
        }
        if (selectedGenres.length === 0) {
            setLoi("Vui lòng chọn ít nhất một thể loại");
            setIsSubmitting(false);
            return;
        }
        if (!selectedFile && editIndex === null) {
            setLoi("Vui lòng chọn poster phim");
            setIsSubmitting(false);
            return;
        }
        if (selectedFile && !["image/jpeg", "image/png"].includes(selectedFile.type)) {
            setLoi("Poster phim phải là file JPEG hoặc PNG");
            setIsSubmitting(false);
            return;
        }
        if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
            setLoi("Poster phim không được vượt quá 5MB");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("Title", form.name);
        formData.append("Description", form.description);
        formData.append("DurationMinutes", form.duration);
        formData.append("Cast", form.actor);
        formData.append("Director", form.director);
        formData.append("TrailerUrl", form.trailer);
        formData.append("ReleaseDate", parsedDate.toISOString());
        formData.append("Language", form.languageId);
        formData.append("AgeRating", form.ageId);
        selectedGenres.forEach((genreId) => formData.append("GenreIds", genreId));
        if (selectedFile) {
            formData.append("PosterFile", selectedFile);
        }

        try {
            const currentToken = localStorage.getItem('authToken');
            const url = editIndex !== null
                ? `${API_BASE_URL}/api/movie/editMovie?movieID=${movies[editIndex].movieId}`
                : `${API_BASE_URL}/api/movie/createMovie`;
            const method = editIndex !== null ? "patch" : "post";
            const res = await axios.request<CreateMovieResponse>({
                method,
                url,
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                    "Content-Type": "multipart/form-data",
                },
                data: formData as any,
                timeout: 30000,
            });

            console.log("Phản hồi từ API (create/update):", res.data);

            if (res.status === 200 || res.status === 201 || res.status === 204) {
                setThanhCong(editIndex !== null ? "Cập nhật phim thành công!" : "Tạo phim thành công!");
                fetchMovies(page);
                setForm({
                    name: "",
                    description: "",
                    duration: "",
                    actor: "",
                    director: "",
                    trailer: "",
                    releaseDate: "",
                    languageId: "",
                    ageId: "",
                });
                setSelectedFile(null);
                setSelectedGenres([]);
                setEditIndex(null);
            } else {
                throw new Error(`Lỗi từ server: ${res.status}`);
            }
        } catch (err: any) {
            let errorMessage = "Lỗi không xác định";
            if (err.response) {
                const errorData = err.response.data;
                errorMessage =
                    errorData?.thongTinLoi?.message ||
                    (Array.isArray(errorData?.errors) ? errorData.errors.join(", ") : errorData?.errors || `Lỗi từ server: ${err.response.status}`);
            } else if (err.request) {
                errorMessage = "Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.";
            } else {
                errorMessage = err.message || "Lỗi không xác định";
            }
            setLoi("Lỗi: " + errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // =================================================================
    // ================== HÀM HANDLEEDIT ĐÃ CẬP NHẬT ==================
    // =================================================================
    const handleEdit = async (index: number) => {
        const movie = movies[index];
        if (!movie.movieId) {
            setLoi("Không tìm thấy ID phim để chỉnh sửa.");
            return;
        }

        setLoi("");
        setThanhCong("");
        setLoading(true);
        window.scrollTo(0, 0); // Cuộn lên đầu trang để xem biểu mẫu

        try {
            const currentToken = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/movie/getMovieDetail/${movie.movieId}`, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`Không thể tải chi tiết phim: ${errorData.message || `HTTP ${res.status}`}`);
            }

            const result = await res.json();
            if (result.status !== "Success") {
                throw new Error(`Lỗi từ API: ${result.message}`);
            }

            const movieDetails = result.data;

            const genreIds = movieDetails.genres ? movieDetails.genres.map((g: any) => g.id || g.genreId) : [];

            setForm({
                name: movieDetails.title || movieDetails.movieName || "",
                description: movieDetails.description || movieDetails.movieDescription || "",
                duration: movieDetails.durationMinutes?.toString() || movieDetails.movieDuration?.toString() || "",
                actor: movieDetails.cast || movieDetails.movieActor || "",
                director: movieDetails.director || movieDetails.movieDirector || "",
                trailer: movieDetails.trailerUrl || movieDetails.movieTrailerUrl || "",
                // Định dạng ngày thành YYYY-MM-DD cho <input type="date">
                releaseDate: movieDetails.releaseDate ? new Date(movieDetails.releaseDate).toISOString().split('T')[0] : "",
                languageId: movieDetails.language || "",
                ageId: movieDetails.ageRating || "",
            });

            setSelectedGenres(genreIds);
            setSelectedFile(null); // Xóa lựa chọn tệp trước đó
            setEditIndex(index); // Theo dõi chỉ mục để gửi đi

        } catch (err: any) {
            setLoi(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (index: number) => {
        setDeleteIndex(index);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteIndex !== null) {
            const movieId = movies[deleteIndex].movieId;
            if (movieId) {
                try {
                    const currentToken = localStorage.getItem('authToken');
                    await axios.delete(`${API_BASE_URL}/api/movie/DeleteMovie/${movieId}`, {
                        headers: {
                            Authorization: `Bearer ${currentToken}`,
                            accept: '*/*'
                        },
                    });
                    setThanhCong("Xóa phim thành công!");
                    fetchMovies(page);
                } catch (err: any) {
                    setLoi("Lỗi khi xóa phim: " + (err.response?.data?.message || err.message));
                }
            } else {
                setLoi("Không tìm thấy movieId để xóa");
            }
        }
        setShowConfirm(false);
        setDeleteIndex(null);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setDeleteIndex(null);
    };

    return (
        <div className="relative min-h-screen w-full font-sans selection:bg-purple-500/30 text-slate-200 flex flex-col">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 bg-slate-950 shadow-md mb-4 border-b border-slate-800/50">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8"><Nav /></div>
            </header>

            <main className="flex-grow">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 text-center uppercase tracking-wider mt-8 sm:mt-12 mb-8">
                    {editIndex !== null ? "Cập nhật phim" : "Thêm phim"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-start items-start max-w-4xl mx-auto px-4 sm:px-0 mb-4">
                        <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 font-bold transition-colors duration-300"
                            onClick={handleHome} type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            Quay lại
                        </button>
                    </div>
                    <div className="flex justify-center px-4 sm:px-0">
                        <div
                            className="w-full sm:w-3/4 md:w-2/3 max-w-4xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative z-10"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    placeholder="Tên phim"
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-white font-medium placeholder-slate-500 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <input
                                    name="director"
                                    value={form.director}
                                    onChange={handleInputChange}
                                    placeholder="Đạo diễn"
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-white font-medium placeholder-slate-500 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <input
                                    name="actor"
                                    value={form.actor}
                                    onChange={handleInputChange}
                                    placeholder="Diễn viên"
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-white font-medium placeholder-slate-500 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <input
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleInputChange}
                                    type="number"
                                    placeholder="Thời lượng (phút)"
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-white font-medium placeholder-slate-500 w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <select
                                    name="languageId"
                                    value={form.languageId}
                                    onChange={handleInputChange}
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-300 font-normal w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                >
                                    <option className="text-black bg-slate-600" value="">
                                        Chọn ngôn ngữ gốc
                                    </option>
                                    {languageOptions.map((lang, index) => (
                                        <option
                                            key={index}
                                            value={lang}
                                            className="text-black bg-slate-600"
                                        >
                                            {lang}
                                        </option>
                                    ))}
                                </select>

                                {/* ĐÃ SỬA: Sửa lại phần map dữ liệu cho độ tuổi */}
                                <select
                                    name="ageId"
                                    value={form.ageId}
                                    onChange={handleInputChange}
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-300 font-normal w-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                >
                                    <option className="text-black bg-slate-600" value="">
                                        Chọn độ tuổi
                                    </option>
                                    {ageOptions.length > 0 ? (
                                        ageOptions.map((age, index) => (
                                            <option
                                                key={index}
                                                value={age.value} // Gửi mã (Vd: T13)
                                                className="text-black bg-slate-600"
                                            >
                                                {age.label} {/* Hiển thị text dài (Vd: T13 (Từ 13 tuổi trở lên)) */}
                                            </option>
                                        ))
                                    ) : (
                                        <option className="text-black bg-slate-600" value="" disabled>
                                            Không có độ tuổi
                                        </option>
                                    )}
                                </select>

                                <div className="flex flex-row rounded-xl border border-slate-700 bg-slate-950/50 py-2 px-3 w-full items-center">
                                    <p className="border-r border-slate-700 pr-3 text-slate-400 shrink-0 text-sm">Poster</p>
                                    <input
                                        name="image"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="pl-3 bg-transparent text-slate-300 file:hidden w-full"
                                    />
                                </div>
                                <div className="flex flex-row rounded-xl border border-slate-700 bg-slate-950/50 py-2 px-3 w-full items-center">
                                    <p className="border-r border-slate-700 pr-3 text-slate-400 shrink-0 text-sm">Ra mắt</p>
                                    <input
                                        name="releaseDate"
                                        value={form.releaseDate}
                                        onChange={handleInputChange}
                                        type="date"
                                        className="pl-3 bg-transparent text-slate-300 w-full"
                                    />
                                </div>
                                <input
                                    type="url"
                                    name="trailer"
                                    value={form.trailer}
                                    onChange={handleInputChange}
                                    placeholder="Chèn URL Trailer"
                                    className="p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-white font-medium placeholder-slate-500 col-span-1 sm:col-span-2 w-full focus:outline-none focus:border-purple-500 transition-all"
                                />
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    placeholder="Mô tả phim"
                                    className="p-3.5 border border-slate-700 rounded-xl col-span-1 sm:col-span-2 bg-slate-950/50 placeholder-slate-500 font-medium text-white w-full focus:outline-none focus:border-purple-500 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-slate-400 font-bold uppercase tracking-wider text-sm">Thể loại</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedGenres.length > 0 ? (
                                        selectedGenres.map((id) => {
                                            const genre = theloaiOptions.find((g) => g.genreId === id);
                                            return (
                                                <span
                                                    key={id}
                                                    className="bg-purple-600/30 border border-purple-500/50 px-3 py-1.5 rounded-lg text-purple-200 flex items-center text-sm font-semibold"
                                                >
                                                    {genre?.genreName || "Unknown Genre"}
                                                    <button
                                                        type="button" // Thêm type="button" để tránh vô tình submit form
                                                        className="text-yellow-300 ml-2"
                                                        onClick={() =>
                                                            setSelectedGenres((prev) => prev.filter((gid) => gid !== id))
                                                        }
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-slate-300">Chưa chọn thể loại</span>
                                    )}
                                </div>
                                <select
                                    onChange={handleGenreChange}
                                    className="w-full p-3.5 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-300 focus:outline-none focus:border-purple-500 transition-all"
                                >
                                    <option className="text-black bg-slate-600" value="">
                                        -- Chọn thể loại --
                                    </option>
                                    {theloaiOptions.length > 0 ? (
                                        theloaiOptions
                                            .filter((g) => !selectedGenres.includes(g.genreId))
                                            .map((g) => (
                                                <option
                                                    className="text-black bg-slate-600"
                                                    key={g.genreId}
                                                    value={g.genreId}
                                                >
                                                    {g.genreName}
                                                </option>
                                            ))
                                    ) : (
                                        <option className="text-black bg-slate-600" value="" disabled>
                                            Không có thể loại
                                        </option>
                                    )}
                                </select>
                            </div>

                            <div className="text-right mt-4 py-5">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full md:w-auto px-10 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {editIndex !== null ? "Cập nhật phim" : isSubmitting ? "Đang xử lý..." : "Thêm phim"}
                                </button>
                            </div>
                            {loi && <p className="text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center font-medium">{loi}</p>}
                            {thanhCong && <p className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center font-medium">{thanhCong}</p>}
                        </div>
                    </div>
                </form>

                <div className="mt-10 px-4 sm:px-10">
                    <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-6 text-center sm:text-left tracking-wide">Danh sách phim</h3>
                    {loading && editIndex === null ? (
                        <p className="text-slate-400 text-center text-lg">Đang tải...</p>
                    ) : loi && movies.length === 0 ? (
                        <p className="text-red-500 text-center">{loi}</p>
                    ) : movies.length === 0 ? (
                        <p className="text-slate-400 text-center text-lg">Chưa có phim nào</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative z-10">
                                <table
                                    className="w-full text-left border-collapse"
                                >
                                    <thead className="bg-slate-800/80 text-purple-400 text-sm tracking-wider uppercase border-b border-slate-700">
                                        <tr>
                                            <th className="p-4 border-b border-slate-700">STT</th>
                                            <th className="p-4 border-b border-slate-700">Poster</th>
                                            <th className="p-4 border-b border-slate-700 w-48 sm:w-72">Tên</th>
                                            <th className="p-4 border-b border-slate-700">Thể loại</th>
                                            <th className="p-4 border-b border-slate-700">Trailer</th>
                                            <th className="p-4 border-b border-slate-700">Ngày ra mắt</th>
                                            <th className="p-4 border-b border-slate-700">Ngôn ngữ</th>
                                            <th className="p-4 border-b border-slate-700 text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {movies.map((m, i) => (
                                            <tr key={m.movieId || m.name + i} className="hover:bg-slate-800/40 transition-colors text-sm sm:text-base border-b border-slate-800/50 last:border-0">
                                                <td className="p-4 text-slate-300 text-center">{i + 1 + (page - 1) * 1}</td>
                                                <td className="p-4 text-slate-300">
                                                    {m.image ? (
                                                        <img
                                                            src={m.image}
                                                            alt={m.name}
                                                            className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-xl shadow-md border border-slate-700 mx-auto"
                                                        />
                                                    ) : (
                                                        <span>Không có poster</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-slate-200 font-bold">{m.name || "Không có tên"}</td>
                                                <td className="p-4 text-slate-400">
                                                    {m.genres?.length > 0 ? m.genres.join(", ") : "Không có thể loại"}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {m.trailer ? (
                                                        <a
                                                            href={m.trailer}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sky-400 hover:text-sky-300 font-semibold"
                                                        >
                                                            Trailer ↗
                                                        </a>
                                                    ) : (
                                                        <span>Không có trailer</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-slate-400">{m.releaseDate || "Không có ngày"}</td>
                                                <td className="p-4 text-slate-400">{m.language || "Không có ngôn ngữ"}</td>
                                                <td className="p-4 flex flex-col sm:flex-row gap-2 justify-center items-center h-full pt-6">
                                                    <button
                                                        onClick={() => handleEdit(i)}
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 border border-slate-600 hover:bg-sky-600 hover:border-sky-500 text-white text-sm font-bold rounded-lg transition-all duration-300 mb-2 sm:mb-0 sm:mr-2"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(i)}
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 border border-slate-600 hover:bg-red-600 hover:border-red-500 text-white text-sm font-bold rounded-lg transition-all duration-300"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center mt-4 gap-2 sm:gap-4 flex-wrap">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="px-6 py-2.5 bg-slate-800 text-slate-300 font-bold border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang trước
                                </button>
                                <span className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-purple-400 font-bold text-sm sm:text-base shadow-inner">Trang {page} / {totalPages}</span>
                                <button
                                    onClick={() => setPage((prev) => prev + 1)}
                                    disabled={page === totalPages}
                                    className="px-6 py-2.5 bg-slate-800 text-slate-300 font-bold border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {showConfirm && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm relative animate-fade-in-up">
                            <div className="text-center p-3 flex-auto justify-center">
                                <h2 className="text-2xl font-bold py-4 text-white">Xác nhận xóa?</h2>
                                <p className="text-slate-400 px-2 text-sm">Bạn có chắc chắn muốn xóa phim này khỏi hệ thống?</p>
                            </div>
                            <div className="p-2 mt-4 text-center space-x-3 flex justify-center">
                                <button
                                    onClick={cancelDelete}
                                    className="px-6 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-700 font-bold transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 font-bold shadow-lg shadow-red-500/30 transition-all"
                                >
                                    Xóa ngay
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Bottom />
            </div>
        </div>
    );
};

export default AddMovie;