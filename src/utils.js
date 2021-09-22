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
