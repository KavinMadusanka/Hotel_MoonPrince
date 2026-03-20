const calculateNights = (checkInDate, checkOutDate) => {
  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);

  const diffMs = outDate - inDate;
  const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return nights;
};

export default calculateNights;