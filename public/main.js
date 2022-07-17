
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


async function getBoard () {
  try {
    const response = await fetch('/gameboards/newest', { method: 'GET' });
    const gameBoard = await response.json();
    const gameDisplay = new GameDisplay(gameBoard[0]);
    gameDisplay.populateBoard()
    gameDisplay.updateScore();
    const localStorageLogic = new LocalStorageLogic (gameDisplay, gameBoard[0])
    localStorageLogic.populate();
    const gameLogic = new GameLogic(gameBoard[0], gameDisplay, localStorageLogic)
    document.querySelector("button").addEventListener("click", gameLogic.playWord)
  } catch (err) {
    console.log(`error ${err}`);
  }
}

getBoard();


function GameDisplay (gameBoard) {
  this.keys = document.querySelectorAll(".hexagon")
  this.hexagonButtons = document.querySelectorAll(".letter-button");
  this.refreshButton = document.querySelector("#refresh-button");
  this.rulesOpenButton = document.querySelector(".fa-circle-info");
  this.rulesCloseButton = document.querySelector(".rules-button");
  this.highScoreOpenButton = document.querySelector("#high-scores-button");
  this.highScoreCloseButton = document.querySelector(".scores-button");
  this.contactCloseButton = document.querySelector(".contact-button");
  this.contactOpenButton = document.querySelector("#contact-button");
  this.alphabetizeButtonMobile = document.querySelector(
    "#alphabetize-button-mobile"
  );
  this.alphabetizeButtonDesktop = document.querySelector(
    "#alphabetize-button-desktop"
  );
  this.clearButton = document.querySelector("#clear-button");
  this.deleteButton = document.querySelector("#delete-button");

  this.successfulGuesses = document.querySelector(
    ".successful-guess-container"
  );
  this.playerScoreDisplays = document.querySelectorAll(".score-number");
  this.possibleScoreDisplays = document.querySelectorAll(".possible-score");
  this.rulesContainer = document.querySelector(".rules");
  this.wordInput = document.querySelector("input");
  this.highScoresContainer = document.querySelector(".high-scores");
  this.highestScore = document.querySelector(".highest-score");
  this.longestWord = document.querySelector(".longest-word");
  this.gamesPlayed = document.querySelector(".games-played");
  this.contactContainer = document.querySelector(".contact");
  this.errorTextContainer = document.querySelector(".error-text");

  this.populateBoard = () => {
    for (let i = 0; i < 7; i++) {
      this.hexagonButtons[i].textContent = gameBoard.board[i];
    }
  };
  this.clearDisplay = () => {
    for (let i = 0; i < 7; i++) {
      this.hexagonButtons[i].innerText = "";
    }
  };
  this.deleteLetter = () => {
    this.wordInput.value = this.wordInput.value.substring(0, this.wordInput.value.length - 1);
  };

  this.shuffleDisplay = () => {
    this.clearDisplay();
    this.hexagonButtons[0].textContent = gameBoard.board[0];
    for (let i = 1; i < 7; i++) {
      let randomNum = Math.ceil(Math.random() * 6);
      while (this.hexagonButtons[randomNum].innerText !== "") {
        randomNum = Math.ceil(Math.random() * 6);
      }
      this.hexagonButtons[randomNum].innerText = gameBoard.board[i];
    }
  };

  this.updateScore = () => {
    this.successfulGuesses.innerText =
      playerScoreCard.words[0] === "" || playerScoreCard.words[0] === " "
        ? playerScoreCard.words.slice(1).join(`, `)
        : playerScoreCard.words.join(`, `); // prevents a leading ,
    this.playerScoreDisplays.forEach((display) => {
      display.textContent = playerScoreCard.score;
    });
    this.possibleScoreDisplays.forEach((display) => {
      display.textContent = gameBoard.totalPoints;
    });
  };

  this.alphabetizeSuccessfulGuesses = () => {
    this.successfulGuesses.innerText =
      playerScoreCard.words[0] === "" || playerScoreCard.words[0] === " "
        ? [...playerScoreCard.words].slice(1).sort().join(`, `)
        : [...playerScoreCard.words].sort().join(`, `);
  };

  this.clearGuess = () => {
    this.wordInput.value = "";
  };

  this.showRules = () => {
    this.hideHighScores();
    this.hideContact();
    this.rulesContainer.removeAttribute("style", "display:block;");
  };

  this.hideRules = () => {
    this.rulesContainer.setAttribute("style", "display:none;");
  };
  this.inputLetterFromButton = (e) => {
    this.wordInput.value += e.target.textContent;
  };

  this.getGuess = () => {
    let inputtedWord = this.wordInput.value.toLowerCase();
    console.log(inputtedWord);
    this.clearGuess();
    return inputtedWord;
  };

  this.updateHighScores = () => {
    this.highestScore.textContent = localStorage.getItem("examenApisHighScore");
    this.longestWord.textContent = localStorage.getItem("examenApisLongestWord");
    this.gamesPlayed.textContent = localStorage.getItem("examenApisDaysPlayed");
  };

  this.showHighScores = () => {
    this.updateHighScores();
    this.hideRules();
    this.hideContact();
    this.highScoresContainer.removeAttribute("style", "display:block;");
  };

  this.hideHighScores = () => {
    this.highScoresContainer.setAttribute("style", "display:none;");
  };

  this.showContact = () => {
    this.hideRules();
    this.hideHighScores();
    this.contactContainer.removeAttribute("style", "display:block;");
  };

  this.hideContact = () => {
    this.contactContainer.setAttribute("style", "display:none;");
  };

  this.keys.forEach((key) => key.addEventListener("click", this.inputLetterFromButton));
  this.refreshButton.addEventListener("click", this.shuffleDisplay);
  this.deleteButton.addEventListener("click", this.deleteLetter);
  this.rulesOpenButton.addEventListener("click", this.showRules);
  this.rulesCloseButton.addEventListener("click", this.hideRules);
  this.highScoreOpenButton.addEventListener("click", this.showHighScores);
  this.highScoreCloseButton.addEventListener("click", this.hideHighScores);
  this.contactOpenButton.addEventListener("click", this.showContact);
  this.contactCloseButton.addEventListener("click", this.hideContact);
  this.alphabetizeButtonMobile.addEventListener(
    "click",
    this.alphabetizeSuccessfulGuesses
  );
  this.alphabetizeButtonDesktop.addEventListener(
    "click",
    this.alphabetizeSuccessfulGuesses
  );
  this.clearButton.addEventListener("click", this.clearGuess);
}

function GameLogic (gameBoard, gameDisplay, localStorageLogic) {
  this.isCurrentPlayValid = false;
  this.checkAPI = async (str) => {
    try {
      const response = await fetch(
        `https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${str}`,
        { mode: "cors" }
      );
      const dataOut = await response.json();
      this.isCurrentPlayValid = Object.keys(dataOut.RDF.Annotation)
        .join("")
        .includes("hasBody");
    } catch (err) {
      console.log(`error ${err}`);
    }
  };

  this.checkIfLatinWordAPI = async (inputtedWord) => {
    await this.checkAPI(inputtedWord)
    if (!this.isCurrentPlayValid) {
      gameDisplay.errorTextContainer.innerHTML = 'Not a Latin word! If we got it wrong, please <a href="mailto:examenapium@gmail.com">email us!</a>';
      return;
    } else {
      gameDisplay.errorTextContainer.innerText = "Our bad! You were correct and earned a bonus 10 points!";
      playerScoreCard.addWord(inputtedWord);
      playerScoreCard.addPoints(this.scoreWord(inputtedWord) + 10);
      gameDisplay.updateScore();
      gameDisplay.updateHighScores();
      localStorageLogic.updateHighScores();
      localStorageLogic.updatePlayerScoreCard();
      console.log(gameBoard._id)
      await fetch(`/gameboards/${gameBoard._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          boardId: gameBoard._id,
          word: inputtedWord,
          score: this.scoreWord(inputtedWord)
        })
      }),
      await fetch(`/dictionary`, {
        method: 'PUT',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          word: inputtedWord,
        })
      })
    }
  };

  this.checkIfWordAleadyPlayed = (word) => {
    return playerScoreCard.words.includes(word);
  };

  this.checkIfWordLongEnough = (word) => {
    return word.length >= 4;
  };

  this.checkIfUsesOneRequiredLetter = (word) => {

    return word.toLowerCase().includes(gameBoard.board[0]);
  };

  this.checkIfAllLettersAllowed = (word) => {
    const wordArray = word.split("");
    for (i = 0; i < wordArray.length; i++) {
      if (!gameBoard.board.includes(wordArray[i])) {
        return false;
      }
    }
    return true;
  };

  this.checkIfValidPlay = (word) => {
    if (!this.checkIfWordLongEnough(word)) {
      gameDisplay.errorTextContainer.innerText =
        "Words should be at least four letters long!";
      return false;
    } else if (!this.checkIfUsesOneRequiredLetter(word)) {
      gameDisplay.errorTextContainer.innerText = "Use the center yellow letter!";
      return false;
    } else if (!this.checkIfAllLettersAllowed(word)) {
      gameDisplay.errorTextContainer.innerText = "Use only the letters on the gameboard!";
      return false;
    } else if (this.checkIfWordAleadyPlayed(word)) {
      gameDisplay.errorTextContainer.innerText = "You already played that word!";
      return false;
    } else {
      return true;
    }
  }

  this.checkIfLatinWordDB = (word) => {
    if (Object.keys(gameBoard.solutions).includes(word)) {
      return true;
    } else return false;
  }

  this.playWord = () => {
    let inputtedWord = gameDisplay.getGuess();
    if (!this.checkIfValidPlay(inputtedWord)) {
      return;
    } else {
      if (!this.checkIfLatinWordDB(inputtedWord)) {
          gameDisplay.errorTextContainer.innerHTML = `Not a valid Latin word! Are we wrong? <button id="double-check"> Double check. </button>`;
          document.querySelector('#double-check').addEventListener('click', this.checkIfLatinWordAPI.bind(null, inputtedWord))
          return;
      } else {
          gameDisplay.errorTextContainer.innerText = "";
          playerScoreCard.addWord(inputtedWord);
          playerScoreCard.addPoints(gameBoard.solutions[inputtedWord]);
          gameDisplay.updateScore();
          gameDisplay.updateHighScores();
          localStorageLogic.updateHighScores();
          localStorageLogic.updatePlayerScoreCard();
      }
    }
  }
  
  this.checkIfPangram = (str, arr) => {
    if (str.length !== arr.length) {
      return false;
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let arrNormalized = [...arr].sort().join("");
    return strNormalized === arrNormalized;
  }

  this.scoreWord = (word) => {
    if (word.length === 4) {
      return 1;
    } else if (this.checkIfPangram(word, gameBoard.board)) {
      return 14;
    } else if (word.length > 4) {
      return word.length;
    }
  }
}

function LocalStorageLogic (gameDisplay, gameBoard) {
  this.date = new Date(Date.now()).toLocaleString().split(",")[0];
  this.populate = () => {
    if (localStorage.getItem("examenApisLastPlayed") == null) {
      console.log('you have not played before!')
      this.setNewLocalStorage();
      gameDisplay.updateHighScores();
      gameDisplay.populateBoard();
    } else if (localStorage.getItem("examenApisLastPlayed") !== this.date || localStorage.getItem("examenApisPuzzleBoard") !== `${gameBoard.board}`) {
      console.log('new day of playing!')
      let currentNumOfDaysPlayed = Number(
        localStorage.getItem("examenApisDaysPlayed")
      );
      localStorage.setItem("examenApisLastPlayed", this.date);
      localStorage.setItem("examenApisPuzzleBoard", `${gameBoard.board}`);
      localStorage.setItem("examenApisPoints", "0");
      localStorage.setItem("examenApisCurrentWords", " ");
      localStorage.setItem(
        "examenApisDaysPlayed",
        `${(currentNumOfDaysPlayed += 1)}`
      );
      gameDisplay.updateHighScores();
      gameDisplay.populateBoard();
    } else {
      playerScoreCard.score = Number(localStorage.getItem("examenApisPoints"));
      playerScoreCard.words = localStorage
        .getItem("examenApisCurrentWords")
        .split(`, `);
      this.updateHighScores();
      gameDisplay.updateHighScores();
      gameDisplay.populateBoard();
      gameDisplay.updateScore();
    }
  },
  this.updateHighScores = () => {
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
  }
  this.updatePlayerScoreCard = () => {
    localStorage.setItem(
      "examenApisCurrentWords",
      `${playerScoreCard.words.join(`, `)}`
    );
    localStorage.setItem("examenApisPoints", `${playerScoreCard.score}`);
  }
  this.setNewLocalStorage = () => {
    localStorage.setItem("examenApisLastPlayed", this.date);
    localStorage.setItem("examenApisPuzzleBoard", `${gameBoard.board}`);
    localStorage.setItem("examenApisPoints", "0");
    localStorage.setItem("examenApisCurrentWords", "");
    localStorage.setItem("examenApisHighScore", "0");
    localStorage.setItem("examenApisLongestWord", " ");
    localStorage.setItem("examenApisDaysPlayed", "1");
  }
};

