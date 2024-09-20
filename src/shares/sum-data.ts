export const SumDataByIndex = (data: number[][]): number[] => {
  const numRows = data.length;
  const numCols = data[0].length;

  // Initialize an array to store the sum for each index
  const result: number[] = new Array(numCols).fill(0);

  // Iterate through the rows and columns
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      // Add the value at the current index to the result array
      result[col] += data[row][col];
    }
  }

  return result;
};
