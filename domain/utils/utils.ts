export const createDateFromString = (dateStr: string) => {
  // Split the string into date and time parts
  const [datePart, timePart] = dateStr.split(' ');

  // Extract year, month, and day from the date part
  const [year, month, day] = datePart.split('-').map(Number);

  // Extract hour, minute, and second from the time part
  const [hour, minute, second] = timePart.split(':').map(Number);

  // Return a new Date object
  return new Date(year, month - 1, day, hour, minute, second);
};
