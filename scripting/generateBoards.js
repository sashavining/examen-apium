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

exports = async function () {
  const mongodb = context.services.get("mongodb-atlas");
  const latinWords = mongodb.db("examen-apium").collection("latin-words");
  const gameboards = mongodb.db("examen-apium").collection("gameboards");
  const board = new GameBoard
  board.generateBoard()

  const allowedLettersRegEx = new RegExp(`^[${board.board.join("")}]+\$`, "g");
  const requiredLetterRegEx = new RegExp(`${board.board[0]}`, "g");

  await latinWords.find().toArray()
        .then(results => {
          const wordArray = results[0].words.split(",")
          let wordMatches = wordArray.filter(word => checkWord(word, allowedLettersRegEx, requiredLetterRegEx)).join(",")
          let cleanedUniqueWordMatches = removeShortWords(removeCommas(getUniqueData(wordMatches)))
          board.solutions = scoreWords(cleanedUniqueWordMatches, board.board)
          board.totalPoints = sumPoints(board.solutions)
          gameboards.insertOne(board)
        })
        .catch (error => console.log(error)) 
}


function getUniqueData (data) {
    return data.split(',').filter((item, i, allItems) => {
      return i === allItems.indexOf(item);
    }).join(',')
  } 
  
function checkIfPangram (str, gameBoard) {
    if (str.length !== gameBoard.length) {
      return false;
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let gameBoardNormalized = [...gameBoard].sort().join("");
    return strNormalized === gameBoardNormalized;
};

function scoreWord (word, gameBoard) {
    if (word.length === 4) {
      return 1;
    } else if (checkIfPangram(word, gameBoard)) {
      return 14;
    } else if (word.length > 4) {
      return word.length;
    }
};

function removeCommas (str) {
    if (str[0] === ",") {
      str = str.slice(1);
    } 
    if (str[str.length - 1] === ",") {
      str = str.slice(0, -1);
    }
    return str
}

function removeShortWords (str) {
    console.log(str)
    const strArray = str.split(",");
    return strArray.filter(x => x.length > 3).join(",")
  }

function scoreWords (words, gameBoard) {
    const wordsArray = words.split(",")
    const scoredWords = {}
    for (const word of wordsArray) {
        scoredWords[word] = scoreWord(word, gameBoard)
    }
    console.log(scoredWords)
    return scoredWords
}

function sumPoints (obj) {
    const values = Object.values(obj)
    return values.reduce((acc, curr) => acc + curr, 0)
};

function checkWord (word, allowedLetters, requiredLetter) {
    return Boolean(word.match(allowedLetters)) && Boolean(word.match(requiredLetter))
}