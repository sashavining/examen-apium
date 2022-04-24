/* requested features:
- keyboard inputs
- delete button for mobile
- total possible points (wait until node.js possible)
*/

class ScoreCard {
  constructor() {
    this.words = [""];
    this.score = 0;
  }
  addWord(word) {
    if (this.words[0] === "") {
      this.words[0] = word;
    } else {
      this.words.push(word);
    }
  }
  addPoints(points) {
    this.score += points;
  }
}

const playerScoreCard = new ScoreCard();

const gameDisplay = (() => {
  const keys = document.querySelectorAll(".hexagon");
  const hexagonButtons = document.querySelectorAll(".letter-button");
  const refreshButton = document.querySelector("#refresh-button");
  const rulesOpenButton = document.querySelector(".fa-circle-info");
  const rulesCloseButton = document.querySelector(".rules-button");
  const highScoreOpenButton = document.querySelector("#high-scores-button");
  const highScoreCloseButton = document.querySelector(".scores-button");
  const contactCloseButton = document.querySelector(".contact-button");
  const contactOpenButton = document.querySelector("#contact-button");
  const alphabetizeButtonMobile = document.querySelector(
    "#alphabetize-button-mobile"
  );
  const alphabetizeButtonDesktop = document.querySelector(
    "#alphabetize-button-desktop"
  );
  const clearButton = document.querySelector("#clear-button");
  const deleteButton = document.querySelector("#delete-button");

  const successfulGuesses = document.querySelector(
    ".successful-guess-container"
  );
  const playerScoreDisplays = document.querySelectorAll(".score-number");
  const rulesContainer = document.querySelector(".rules");
  const wordInput = document.querySelector("input");
  const highScoresContainer = document.querySelector(".high-scores");
  const highestScore = document.querySelector(".highest-score");
  const longestWord = document.querySelector(".longest-word");
  const gamesPlayed = document.querySelector(".games-played");
  const contactContainer = document.querySelector(".contact");

  const populateBoard = () => {
    for (let i = 0; i < 7; i++) {
      hexagonButtons[i].textContent = gameBoard.getBoard()[i];
    }
  };
  const clearDisplay = () => {
    for (let i = 0; i < 7; i++) {
      hexagonButtons[i].innerText = "";
    }
  };
  const deleteLetter = () => {
    console.log("deleting last letter!");
    console.log(wordInput.value);
    wordInput.value = wordInput.value.substring(0, wordInput.value.length - 1);
  };

  const shuffleDisplay = () => {
    clearDisplay();
    hexagonButtons[0].textContent = gameBoard.getBoard()[0];
    for (let i = 1; i < 7; i++) {
      let randomNum = Math.ceil(Math.random() * 6);
      while (hexagonButtons[randomNum].innerText !== "") {
        randomNum = Math.ceil(Math.random() * 6);
      }
      hexagonButtons[randomNum].innerText = gameBoard.getBoard()[i];
    }
  };

  const updateScore = () => {
    successfulGuesses.innerText =
      playerScoreCard.words[0] === "" || playerScoreCard.words[0] === " "
        ? playerScoreCard.words.slice(1).join(`, `)
        : playerScoreCard.words.join(`, `); // prevents a leading ,
    playerScoreDisplays.forEach((display) => {
      display.textContent = playerScoreCard.score;
    });
  };

  const alphabetizeSuccessfulGuesses = () => {
    successfulGuesses.innerText =
      playerScoreCard.words[0] === "" || playerScoreCard.words[0] === " "
        ? [...playerScoreCard.words].slice(1).sort().join(`, `)
        : [...playerScoreCard.words].sort().join(`, `);
  };

  const clearGuess = () => {
    wordInput.value = "";
  };

  const showRules = () => {
    hideHighScores();
    hideContact();
    rulesContainer.removeAttribute("style", "display:block;");
  };

  const hideRules = () => {
    rulesContainer.setAttribute("style", "display:none;");
  };
  const inputLetterFromButton = (e) => {
    wordInput.value += e.target.textContent;
  };

  const getGuess = () => {
    let inputtedWord = wordInput.value.toLowerCase();
    clearGuess();
    return inputtedWord;
  };

  const updateHighScores = () => {
    highestScore.textContent = localStorage.getItem("examenApisHighScore");
    longestWord.textContent = localStorage.getItem("examenApisLongestWord");
    gamesPlayed.textContent = localStorage.getItem("examenApisDaysPlayed");
  };

  const showHighScores = () => {
    updateHighScores();
    hideRules();
    hideContact();
    highScoresContainer.removeAttribute("style", "display:block;");
  };

  const hideHighScores = () => {
    highScoresContainer.setAttribute("style", "display:none;");
  };

  const showContact = () => {
    hideRules();
    hideHighScores();
    contactContainer.removeAttribute("style", "display:block;");
  };

  const hideContact = () => {
    contactContainer.setAttribute("style", "display:none;");
  };

  keys.forEach((key) => key.addEventListener("click", inputLetterFromButton));
  refreshButton.addEventListener("click", shuffleDisplay);
  deleteButton.addEventListener("click", deleteLetter);
  rulesOpenButton.addEventListener("click", showRules);
  rulesCloseButton.addEventListener("click", hideRules);
  highScoreOpenButton.addEventListener("click", showHighScores);
  highScoreCloseButton.addEventListener("click", hideHighScores);
  contactOpenButton.addEventListener("click", showContact);
  contactCloseButton.addEventListener("click", hideContact);
  alphabetizeButtonMobile.addEventListener(
    "click",
    alphabetizeSuccessfulGuesses
  );
  alphabetizeButtonDesktop.addEventListener(
    "click",
    alphabetizeSuccessfulGuesses
  );
  clearButton.addEventListener("click", clearGuess);

  return { getGuess, updateScore, updateHighScores, populateBoard };
})();

const gameBoard = (() => {
  const letters =
    "aaaaaaaaabccccdddeeeeeeeeeeefghiiiiiiiiiiilllmmmmmnnnnnnooooopppqqrrrrrrrssssssssttttttttuuuuuuuuuv";
  // letter frequencies from https://www.sttmedia.com/characterfrequency-latin. Any letter that appears < 1% has been omitted
  const board = [];
  const resetBoard = () => {
    for (i = 0; i < 7; i++) {
      board.pop();
    }
  };
  const generateBoard = () => {
    resetBoard();
    let generatedLetter = letters.charAt(
      Math.floor(Math.random() * letters.length)
    );
    for (i = 0; i < 7; i++) {
      while (board.includes(generatedLetter)) {
        generatedLetter = letters.charAt(
          Math.floor(Math.random() * letters.length)
        );
      }
      if (generatedLetter === "q" && !board.join("").includes("u")) {
        if (board.length < 6) {
          board.push(generatedLetter);
          board.push("u");
          i++;
          continue;
        } else {
          board.push(generatedLetter);
          board[2] = "u";
          continue;
        }
      }
      board.push(generatedLetter);
    }
  };
  const updateFromLocalStorage = () => {
    resetBoard();
    board.push(...localStorage.getItem("examenApisPuzzleBoard").split(","));
  };
  const getBoard = () => {
    return board;
  };
  return { generateBoard, updateFromLocalStorage, getBoard };
})();

const gameLogic = (() => {
  let isCurrentPlayValid;
  const errorTextContainer = document.querySelector(".error-text");

  const checkIfLatinWord = async function (str) {
    try {
      const response = await fetch(
        `https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${str}`,
        { mode: "cors" }
      );
      const dataOut = await response.json();
      isCurrentPlayValid = Object.keys(dataOut.RDF.Annotation)
        .join("")
        .includes("hasBody");
    } catch (err) {
      console.log(`error ${err}`);
    }
  };

  const checkIfWordAleadyPlayed = (word) => {
    return playerScoreCard.words.includes(word);
  };

  const checkIfWordLongEnough = (word) => {
    return word.length >= 4;
  };

  const checkIfUsesOneRequiredLetter = (word) => {
    return word.toLowerCase().includes(gameBoard.getBoard()[0]);
  };

  const checkIfAllLettersAllowed = (word) => {
    const wordArray = word.split("");
    for (i = 0; i < wordArray.length; i++) {
      if (!gameBoard.getBoard().includes(wordArray[i])) {
        return false;
      }
    }
    return true;
  };

  const checkIfPangram = (str, arr) => {
    if (str.length !== arr.length) {
      return false;
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let arrNormalized = [...arr].sort().join("");
    return strNormalized === arrNormalized;
  };

  const scoreWord = (word) => {
    if (word.length === 4) {
      return 1;
    } else if (checkIfPangram(word, gameBoard.getBoard())) {
      return 14;
    } else if (word.length > 4) {
      return word.length;
    }
  };

  const playWord = () => {
    let inputtedWord = gameDisplay.getGuess();
    if (!checkIfWordLongEnough(inputtedWord)) {
      errorTextContainer.innerText =
        "Words should be at least four letters long!";
      return;
    } else if (!checkIfUsesOneRequiredLetter(inputtedWord)) {
      errorTextContainer.innerText = "Use the center yellow letter!";
      return;
    } else if (!checkIfAllLettersAllowed(inputtedWord)) {
      errorTextContainer.innerText = "Use only the letters on the gameboard!";
      return;
    } else if (checkIfWordAleadyPlayed(inputtedWord)) {
      errorTextContainer.innerText = "You already played that word!";
      return;
    } else {
      checkIfLatinWord(inputtedWord).then(() => {
        if (!isCurrentPlayValid) {
          errorTextContainer.innerText = "That is not a valid Latin word!";
          return;
        } else {
          errorTextContainer.innerText = "";
          playerScoreCard.addWord(inputtedWord);
          playerScoreCard.addPoints(scoreWord(inputtedWord));
          gameDisplay.updateScore();
          gameDisplay.updateHighScores();
          localStorageLogic.updateHighScores();
          localStorageLogic.updatePlayerScoreCard();
        }
      });
    }
  };

  document.querySelector("button").addEventListener("click", playWord);
})();

const localStorageLogic = {
  date: new Date(Date.now()).toLocaleString().split(",")[0],
  populateOnPageLoad() {
    if (localStorage.getItem("examenApisLastPlayed") === null) {
      gameBoard.generateBoard();
      this.setNewLocalStorage();
      gameDisplay.updateHighScores();
      gameDisplay.populateBoard();
    } else if (localStorage.getItem("examenApisLastPlayed") !== this.date) {
      let currentNumOfDaysPlayed = Number(
        localStorage.getItem("examenApisDaysPlayed")
      );
      gameBoard.generateBoard();
      localStorage.setItem("examenApisLastPlayed", this.date);
      localStorage.setItem("examenApisPuzzleBoard", `${gameBoard.getBoard()}`);
      localStorage.setItem("examenApisPoints", "0");
      localStorage.setItem("examenApisCurrentWords", " ");
      localStorage.setItem(
        "examenApisDaysPlayed",
        `${(currentNumOfDaysPlayed += 1)}`
      );
      gameDisplay.updateHighScores();
      gameDisplay.populateBoard();
    } else {
      gameBoard.updateFromLocalStorage();
      playerScoreCard.score = Number(localStorage.getItem("examenApisPoints"));
      playerScoreCard.words = localStorage
        .getItem("examenApisCurrentWords")
        .split(`, `);
      localStorageLogic.updateHighScores();
      gameDisplay.updateHighScores();
      gameDisplay.populateBoard();
      gameDisplay.updateScore();
    }
  },
  updateHighScores() {
    if (
      playerScoreCard.score >
      Number(localStorage.getItem("examenApisHighScore"))
    ) {
      localStorage.setItem("examenApisHighScore", `${playerScoreCard.score}`);
    }
    playerScoreCard.words.forEach((word) => {
      if (word.length > Number(localStorage.getItem("examenApisLongestWord"))) {
        localStorage.setItem("examenApisLongestWord", `${word.length}`);
      }
    });
  },
  updatePlayerScoreCard() {
    localStorage.setItem(
      "examenApisCurrentWords",
      `${playerScoreCard.words.join(`, `)}`
    );
    localStorage.setItem("examenApisPoints", `${playerScoreCard.score}`);
  },
  setNewLocalStorage() {
    localStorage.setItem("examenApisLastPlayed", this.date);
    localStorage.setItem("examenApisPuzzleBoard", `${gameBoard.getBoard()}`);
    localStorage.setItem("examenApisPoints", "0");
    localStorage.setItem("examenApisCurrentWords", "");
    localStorage.setItem("examenApisHighScore", "0");
    localStorage.setItem("examenApisLongestWord", " ");
    localStorage.setItem("examenApisDaysPlayed", "1");
  },
};

localStorageLogic.populateOnPageLoad();
