export const stringArraysAreIdentical = (array1, array2) => {
  if (!Array.isArray(array1) || !Array.isArray(array2))
    throw new Error("Function only accepts arrays");
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (typeof array1[i] !== "string" || typeof array2[i] !== "string")
      throw new Error("Function only compares string arrays");
    if (array1[i] !== array2[i]) return false;
  }
  return true;
};

export const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
