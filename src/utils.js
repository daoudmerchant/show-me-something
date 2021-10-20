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

// manual object utils for known structures, replace
// with library-based solution if database refactored

export const getNewButtons = (prevButtons) => {
  // deep clone
  return prevButtons.map((button) => ({
    ...button,
    style: { ...button.style },
    subreddits: [...button.subreddits],
  }));
};

export const checkButtonEquality = (prevButton, newButton) => {
  const _checkParamArrayEquality = (param) => {
    return prevButton[param].every(
      (prevItem, i) => prevItem === newButton[param][i]
    );
  };
  return (
    prevButton.text === newButton.text &&
    prevButton.id === newButton.id &&
    _checkParamArrayEquality("style") &&
    _checkParamArrayEquality("subreddits")
  );
};
