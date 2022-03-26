import randomWords from 'random-words';

const difficultyLength = (level) => {
  switch (level) {
    case 'easy':
      return 3;
    case 'medium':
      return 4;
    default:
      return 7;
  }
};

export const getWords = (numberOfWord = 3, difficulty = 'easy') => {
  const wordLength = difficultyLength(difficulty);
  const words = randomWords({ exactly: numberOfWord, maxLength: wordLength });
  return words;
};
