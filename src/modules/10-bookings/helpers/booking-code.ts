let currentBooking = 0;

export const resetSttBooking = () => {
  currentBooking = 0;
};

export const setCurrentBooking = (booking: number) => {
  currentBooking = booking;
};

export const getNextSettBooking = () => {
  currentBooking++;

  return currentBooking;
};

export const generateBookingCode = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  const code = `${year}${month}${day}${hour}${minute}${currentBooking++}`;
  return code;
};
