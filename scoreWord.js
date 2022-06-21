const checkIfPangram = (str, arr) => {
    if (str.length !== arr.length) {
      return false;
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let arrNormalized = [...arr].sort().join("");
    return strNormalized === arrNormalized;
  };

  const scoreWord = (word, gameBoard) => {
    if (word.length === 4) {
      return 1;
    } else if (checkIfPangram(word, gameBoard.getBoard())) {
      return 14;
    } else if (word.length > 4) {
      return word.length;
    }
  };

  module.exports = {scoreWord}