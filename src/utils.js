export const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const insertLineBreaks = (string) => {
  return string
    .replace(/&#x200B;/g, "")
    .replace(/\u00A0/g, "")
    .split(/[\n]/)
    .filter((string) => !!string & (string !== " "));
};
