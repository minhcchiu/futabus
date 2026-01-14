export enum PaymentStatus {
  UNPAID = "UNPAID", // Chưa thanh toán
  PENDING = "PENDING", // Đang xử lý (redirect cổng)
  PAID = "PAID", // Thanh toán thành công
  FAILED = "FAILED", // Thanh toán lỗi
  REFUNDING = "REFUNDING", // Đang hoàn tiền
  REFUNDED = "REFUNDED", // Đã hoàn tiền
}
