import React from "react";
import Nav from "../Header/nav";
import Bottom from "../Footer/bottom";
import logo from "../image/logocinema1.png";
import Snowfall from "../Components/Snowfall";


function Introduce() {

    return (
        <div className="relative min-h-screen w-full font-sans selection:bg-purple-500/30 text-slate-200">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images8.alphacoders.com/136/thumb-1920-1368754.jpeg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
            </div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
            <Snowfall />
            <div className="sticky top-0 z-50 bg-slate-950 shadow-md mb-4 border-b border-slate-800/50">
                <div className="max-w-screen-xl mx-auto px-8">
                    <Nav />
                </div>
            </div>
            <div>
                <div className="w-full">
                    {/* Banner */}
                    <div
                        className="relative w-full h-64 md:h-80 bg-cover bg-center flex items-center justify-center overflow-hidden"
                        style={{
                            backgroundImage:
                                "url('https://cinestar.com.vn/pictures/moi/vechungtoi/slider.jpg')",
                        }}
                    >
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
                        <h1 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 text-4xl md:text-5xl font-extrabold drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] text-center uppercase tracking-wider">
                            Giới Thiệu Cinema
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="max-w-5xl mx-auto py-12 px-4 md:px-8 my-8 space-y-8 text-slate-300 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 uppercase tracking-wide">
                            Về Chúng Tôi
                        </h2>
                        <p className="leading-relaxed text-lg">
                            Hệ thống rạp chiếu phim CINEHA là một thương hiệu rạp phim mới,
                            phục vụ nhu cầu thưởng thức phim ảnh chất lượng cao với giá vé phù hợp
                            cho mọi đối tượng khán giả. CINEHA được đầu tư hệ thống thiết bị hiện đại
                            đạt chuẩn quốc tế về chiếu phim và âm thanh.
                        </p>
                        <p className="leading-relaxed text-lg">
                            Chúng tôi luôn cam kết mang đến cho khách hàng trải nghiệm xem phim tuyệt vời nhất,
                            không gian thoải mái, dịch vụ chuyên nghiệp và các chương trình ưu đãi hấp dẫn.
                        </p>
                        {/* Hình minh họa */}
                        <div className="w-full flex justify-center text-white py-6">
                            <img
                                src={logo} alt="logo"
                                className="w-96 h-44 hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500 uppercase tracking-wide">
                            Tầm Nhìn & Sứ Mệnh
                        </h2>
                        <p className="leading-relaxed pb-20 text-lg">
                            CINEHA phấn đấu trở thành chuỗi rạp chiếu phim được yêu thích nhất,
                            không ngừng đổi mới và nâng cao chất lượng phục vụ để đáp ứng sự tin tưởng của khách hàng.
                        </p>
                        <div
                            className="group relative flex justify-center items-center text-zinc-600 text-sm font-bold">
                            <div
                                className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md">
                                <div className="bg-lime-200 flex items-center gap-1 p-2 rounded-md uppercase">
                                    <svg
                                        className="stroke-zinc-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                    </svg>
                                    <span>🫶 CINEHA XIN CHÂN THÀNH CẢM ƠN 🫶   </span>
                                </div>
                                <div
                                    className="shadow-md bg-lime-200 absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"
                                ></div>
                                <div
                                    className="rounded-md bg-white group-hover:opacity-0 group-hover:scale-[115%] group-hover:delay-700 duration-500 w-full h-full absolute top-0 left-0"
                                >
                                    <div
                                        className="border-b border-r border-white bg-white absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"
                                    ></div>
                                </div>
                            </div>

                            <div className="shadow-md flex items-center group-hover:gap-2 bg-gradient-to-br from-lime-200 to-yellow-200 p-3 rounded-full cursor-pointer duration-300">
                                <span>❤️</span>
                                <span className="text-[0px] group-hover:text-sm duration-300"
                                >CẢM ƠN VÌ ĐÃ CHỌN CHÚNG TÔI ❤️</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="pt-32 min-w-full">
                <Bottom />
            </div>
            </div>
        </div>
    );
}

export default Introduce;
