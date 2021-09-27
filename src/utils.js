export const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const insertLineBreaks = (string) => {
  let stringWithoutNBS = string.replace("&#x200B;", "");
  let splitStringArray = stringWithoutNBS.split(/[\n]/);
  if (splitStringArray.length === 1) return string;
  return splitStringArray
    .map((string, i) => {
      if (!string) return undefined;
      // if (i === 0) {
      return <p>{string}</p>;
      // }
      // return [<br />, <p>{string}</p>];
    })
    .flat();
};
