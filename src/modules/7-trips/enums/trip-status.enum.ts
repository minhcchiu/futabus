export enum TripStatus {
  CREATED = "CREATED", // Đã tạo chuyến, chưa khởi hành
  READY = "READY", // Sẵn sàng khởi hành
  OPEN = "OPEN", // Đang mở
  DEPARTED = "DEPARTED", // Đã khởi hành
  IN_PROGRESS = "IN_PROGRESS", // Đang chạy
  COMPLETED = "COMPLETED", // Hoàn thành chuyến
  CANCELLED = "CANCELLED", // Hủy chuyến
}

// CREATED
//   ↓
// READY
//   ↓
// OPEN
//   ↓
// DEPARTED
//   ↓
// IN_PROGRESS
//   ↓
// COMPLETED
