// This code is included for portfolio / instructive purposes only - it runs as a trigger on MongoDB every evening at 11:59PM.

function GameBoard () {
  this.letters = "aaaaaaaaabccccdddeeeeeeeeeeefghiiiiiiiiiiilllmmmmmnnnnnnooooopppqqrrrrrrrssssssssttttttttuuuuuuuuuv";
  // letter frequencies from https://www.sttmedia.com/characterfrequency-latin. Any letter that appears < 1% has been omitted
  this.board = [];
  this.resetBoard = () => {
    for (let i = 0; i < 7; i++) {
        this.board.pop();
    }
  }
  this.generateBoard = () => {
    this.resetBoard();
    let generatedLetter = this.letters.charAt(
      Math.floor(Math.random() * this.letters.length)
    );
    for (let i = 0; i < 7; i++) {
      while (this.board.includes(generatedLetter)) {
        generatedLetter = this.letters.charAt(
          Math.floor(Math.random() * this.letters.length)
        );
      }
      if (generatedLetter === "q" && !this.board.join("").includes("u")) {
        if (this.board.length < 6) {
          this.board.push(generatedLetter);
          this.board.push("u");
          i++;
          continue;
        } else {
          this.board.push(generatedLetter);
          this.board[2] = "u";
          continue;
        }
      }
        this.board.push(generatedLetter);
    }
  };
}

//   exports = async function () {
//   const mongodb = context.services.get("mongodb-atlas");
//   const latinWords = mongodb.db("examen-apium").collection("latin-words");
//   const gameboards = mongodb.db("examen-apium").collection("gameboards");
//   const board = new GameBoard
//   board.generateBoard()

//   await latinWords.find().toArray()
//         .then(results => {
//           const wordArray = results[0].words.split(",")
//           let wordMatches = wordArray.filter(word => checkWord(word, allowedLettersRegEx, requiredLetterRegEx)).join(",")
//           let cleanedUniqueWordMatches = cleanStr(wordMatches).split(",")
//           board.solutions = scoreWords(cleanedUniqueWordMatches, board.board)
//           board.totalPoints = sumPoints(board.solutions)
//           gameboards.insertOne(board)
//         })
//         .catch (error => console.log(error)) 
// }

/*
Args: 
  1. An array of words to be scored
  2. An array representing the gameboard

Return: An object, with keys representing the words passed in and values representing their scores
*/

function scoreWords (words, gameBoard) {
  if (!words || !gameBoard) {
    return {}
  } else {
    const scoredWords = {}
    for (const word of words) {
      scoredWords[word] = scoreWord(word, gameBoard)
    }
    return scoredWords
  }
}

function scoreWord (word, gameBoard) {
  if (word.length === 4) {
    return 1;
  } else if (checkIfPangram(word, gameBoard)) {
    return 14;
  } else if (word.length > 4) {
    return word.length;
  }
};

function checkIfPangram (str, gameBoard) {
  if (str.length !== gameBoard.length) {
    return false;
  }
  let strNormalized = str.toLowerCase().split("").sort().join("");
  let gameBoardNormalized = [...gameBoard].sort().join("");
  return strNormalized === gameBoardNormalized;
};

/* This function sums all of the possible points available for a board.

Args: An object, where keys are strings (words) and values are numbers representing # of points the word is worth.
Return: A number, representing the total number of points available

*/

function sumPoints (obj) {
  const values = Object.values(obj)
  return values.reduce((acc, curr) => acc + curr, 0)
};


/* These functions process a comma-separated word list according to the following requirements:

1. Words should be four letters long or longer
2. Words should be unique (no duplicates)
3. Words should be separated by only a single comma.

CleanStr calls the functions to do each of these 3. 

Args: A str to be cleaned (comma-separated list of word characters)
Return: A cleaned str (according to the rules above)
*/

function cleanStr (str) {
  if (str) {
    return removeShortWords(removeCommas(getUniqueData(str)))
  } else return ''
}

function removeCommas (str) {
    if (str[0] === ",") {
      str = str.slice(1);
    } 
    if (str[str.length - 1] === ",") {
      str = str.slice(0, -1);
    }
    return str
}

function getUniqueData (str) {
  return str.split(',').filter((item, i, allItems) => {
    return i === allItems.indexOf(item);
  }).join(',')
} 

function removeShortWords (str) {
    const strArray = str.split(",");
    return strArray.filter(x => x.length > 3).join(",")
  }


/* Args: 
  1. word (string) to be checked
  2. allowedLetters (string), which should include the requiredLetter
  3. requiredLetter (string)

  Output: Boolean (true if the word is made up of letters from allowedLetters and no others, AND includes the required letter; false otherwise)
  It will also return false if you do not supply it all of the required arguments
*/

function checkWord (word, allowedLetters, requiredLetter) {
  if (word && allowedLetters && requiredLetter) {
    const allowedLettersRegEx = new RegExp(`^[${allowedLetters}]+\$`, "g");
    const requiredLetterRegEx = new RegExp(`${requiredLetter}`, "g");
    return Boolean(word.match(allowedLettersRegEx)) && Boolean(word.match(requiredLetterRegEx))
  } else return false
}

module.exports = {checkWord, scoreWords, cleanStr, sumPoints, GameBoard}