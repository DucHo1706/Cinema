using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Interface.CommentInterface;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.CommentService
{
    public class CommentService : ICommentService
    {
        private readonly DataContext _context;

        public CommentService(DataContext context)
        {
            _context = context;
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> GetCommentsByMovieAsync(string movieId)
        {
            var isMovieExist = await _context.Movies.AnyAsync(m => m.MovieId == movieId && m.IsDeleted == false);
            if (isMovieExist == false)
            {
                return (false, "Phim không tồn tại", null);
            }

            var comments = await _context.Set<Comment>()
                .Include(c => c.User)
                .Where(c => c.MovieId == movieId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentResponseDTO
                {
                    CommentId = c.CommentId,
                    MovieId = c.MovieId,
                    UserId = c.UserId,
                    FullName = c.User.FullName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return (true, "Lấy danh sách bình luận thành công", comments);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> AddCommentAsync(string userId, CreateCommentRequestDTO request)
        {
            var isMovieExist = await _context.Movies.AnyAsync(m => m.MovieId == request.MovieId && m.IsDeleted == false);
            if (isMovieExist == false)
            {
                return (false, "Phim không tồn tại", null);
            }

            var comment = new Comment
            {
                MovieId = request.MovieId,
                UserId = userId,
                Content = request.Content,
                CreatedAt = DateTime.Now
            };

            await _context.Set<Comment>().AddAsync(comment);
            await _context.SaveChangesAsync();

            return (true, "Thêm bình luận thành công", comment.CommentId);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> UpdateCommentAsync(string userId, string commentId, UpdateCommentRequestDTO request)
        {
            var comment = await _context.Set<Comment>().FindAsync(commentId);
            if (comment == null) return (false, "Không tìm thấy bình luận", null);
            if (comment.UserId != userId) return (false, "Bạn không có quyền sửa bình luận này", null);

            comment.Content = request.Content;
            _context.Set<Comment>().Update(comment);
            await _context.SaveChangesAsync();

            return (true, "Cập nhật bình luận thành công", null);
        }

        public async Task<(bool IsSuccess, string Message, object? Data)> DeleteCommentAsync(string userId, string commentId)
        {
            var comment = await _context.Set<Comment>().FindAsync(commentId);
            if (comment == null) return (false, "Không tìm thấy bình luận", null);

            if (comment.UserId != userId) return (false, "Bạn không có quyền xóa bình luận này", null);

            _context.Set<Comment>().Remove(comment);
            await _context.SaveChangesAsync();

            return (true, "Xóa bình luận thành công", null);
        }
    }
}