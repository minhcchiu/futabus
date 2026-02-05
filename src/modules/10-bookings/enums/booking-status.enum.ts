export enum BookingStatus {
  PENDING = "PENDING", // Giữ chỗ tạm (chưa thanh toán)
  CONFIRMED = "CONFIRMED", // Đã thanh toán / xác nhận vé
  CANCELLED = "CANCELLED", // Khách hủy (trước giờ chạy)
  EXPIRED = "EXPIRED", // Hết thời gian giữ chỗ
  NO_SHOW = "NO_SHOW", // Không lên xe
  COMPLETED = "COMPLETED", // Chuyến kết thúc
  REFUNDED = "REFUNDED", // Đã hoàn tiền
}
