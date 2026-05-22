using System;
using System.Collections.Generic;

namespace backend.DTOs.Responses
{
    public class BookingHistoryResponseDTO
    {
        public string OrderId { get; set; }
        public string CinemaName { get; set; }
        public string RoomName { get; set; }
        public string MovieName { get; set; }
        public DateTime StartTime { get; set; }
        public string Status { get; set; } 
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class BookingHistoryDetailResponseDTO : BookingHistoryResponseDTO
    {
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string CustomerEmail { get; set; }
        public string SeatList { get; set; } 
        public Dictionary<string, int> ProductList { get; set; } 
    }
}