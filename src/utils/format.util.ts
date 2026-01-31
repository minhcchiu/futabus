export const formatMoney = (v: number) => v.toLocaleString("vi-VN") + "đ";

export const formatDateTime = (timestamp?: number) => {
  if (!timestamp) return "--";
  const d = new Date(timestamp);
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
