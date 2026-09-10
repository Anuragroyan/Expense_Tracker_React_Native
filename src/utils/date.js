// Convert a date into a readable format
export const formatDate = date => {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toLocaleDateString();
};

// Convert a date into YYYY-MM-DD
export const formatDateForApi = date => {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const year = parsedDate.getFullYear();
  const month = String(
    parsedDate.getMonth() + 1,
  ).padStart(2, '0');
  const day = String(
    parsedDate.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Check whether a date is valid
export const isValidDate = date => {
  if (!date) {
    return false;
  }

  const parsedDate = new Date(date);

  return !Number.isNaN(parsedDate.getTime());
};