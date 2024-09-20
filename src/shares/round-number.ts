export const RoundNumber = (num: number): number => {
  if (num >= 4) return Math.round(num);
  return Math.ceil(num / 0.5) * 0.5;
};
