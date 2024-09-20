export const GetFullYear = (): number => {
  return new Date().getFullYear();
};

export const GetStartYear = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-01-01`;
  return formattedDate;
};

export const GetEndYear = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-12-31`;
  return formattedDate;
};
export const GetDateNow = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month because it's 0-based.
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const GetYesterDay = (): string => {
  const today = new Date();
  const yesterdayDate = new Date(today.getTime() - 86400000);
  const year = yesterdayDate.getFullYear();
  const month = String(yesterdayDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month because it's 0-based.
  const day = String(yesterdayDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
