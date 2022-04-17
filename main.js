document.querySelector('button').addEventListener('click', playWord);

const gameBoard = new Board;
// **doesn't update DOM with player scorecard values**
// doesn't update the scorecard on page load either

const playerScoreCard = {
    words: [],
    score: 0,
}
const gameDisplay = {
    hexagonDivNumber: ["one", "two", "three", "four", "five", "six", "seven"],

    populateDisplay () {
        for (i = 0; i < 7; i ++) {
            const container = document.querySelector(`.${this.hexagonDivNumber[i]}`).firstChild
            container.textContent = gameBoard.board[i]
        }
    },
    clearDisplay () {
        for (i = 0; i < 7; i ++) {
            const container = document.querySelector(`.${this.hexagonDivNumber[i]}`).firstChild
            container.innerText = "";
        }
    },
    shuffleDisplay () {
        this.clearDisplay();
        const container = document.querySelector(`.${this.hexagonDivNumber[0]}`).firstChild
        container.textContent = gameBoard.board[0]
        for (i = 1; i < 7; i++) {
            let randomNum = Math.ceil(Math.random() * 6);
            while (document.querySelector(`.${this.hexagonDivNumber[randomNum]}`).firstChild.innerText !== "") {
                randomNum = Math.ceil(Math.random()* 6);
            }
            console.log(randomNum);
            const container = document.querySelector(`.${this.hexagonDivNumber[randomNum]}`).firstChild
            console.log(container);
            container.innerText = gameBoard.board[i]
        }
    },
    updateScore () {
        const successfulGuesses = document.querySelector('.successful-guess-container');
        const playerScore = document.querySelector('.score-number');
        successfulGuesses.innerText = playerScoreCard.words.join(", ");
        playerScore.innerText = playerScoreCard.score;
    },
    showRules () {
        const rulesContainer = document.querySelector(".rules");
        rulesContainer.removeAttribute('style', 'display:block;')
    },   
    hideRules () {
        const rulesContainer = document.querySelector(".rules");
        rulesContainer.setAttribute('style', 'display:none;')
    },
    inputLetterFromButton (e) {
        const wordInput = document.querySelector('input');
        console.log(wordInput);
        console.log(`adding letter ${e.target.textContent} to ${wordInput.textContent}`)
        wordInput.value += e.target.textContent;
    },
    updateHighScores () {
        const highestScore = document.querySelector(".highest-score");
        const longestWord = document.querySelector(".longest-word");
        const gamesPlayed = document.querySelector(".games-played");
        highestScore.textContent = localStorage.getItem('examenApisHighScore');
        longestWord.textContent = localStorage.getItem('examenApisLongestWord');
        gamesPlayed.textContent = localStorage.getItem('examenApisDaysPlayed');
    },
    showHighScores () {
        this.updateHighScores();
        const highScoresContainer = document.querySelector(".high-scores");
        highScoresContainer.removeAttribute('style', 'display:block;')
    },
    hideHighScores () {
        const highScoresContainer = document.querySelector(".high-scores");
        highScoresContainer.setAttribute('style', 'display:none;')
    }
}


function populateLocalStorageOnPageLoad () {
    const date = new Date(Date.now()).toLocaleString().split(',')[0]
    if(localStorage.getItem("examenApisLastPlayed") === null) {
        gameBoard.generateBoard();
        localStorage.setItem('examenApisLastPlayed', date);
        localStorage.setItem('examenApisPuzzleBoard', `${gameBoard.board}`);
        localStorage.setItem('examenApisPoints', '0');
        localStorage.setItem('examenApisCurrentWords', '[]');
        localStorage.setItem('examenApisHighScore', '0');
        localStorage.setItem('examenApisLongestWord', ' ');
        localStorage.setItem('examenApisDaysPlayed', '0');
    } else if (localStorage.getItem("examenApisLastPlayed") !== date) {
        gameBoard.generateBoard();
        localStorage.setItem('examenApisLastPlayed', date);
        localStorage.setItem('examenApisPuzzleBoard', `${gameBoard.board}`);
        localStorage.setItem('examenApisPoints', '0');
        localStorage.setItem('examenApisCurrentWords', '[]');
        let currentNumOfDaysPlayed = Number(localStorage.getItem('examenApisDaysPlayed'));
        localStorage.setItem('examenApisDaysPlayed', `${currentNumOfDaysPlayed += 1}`);
        gameDisplay.updateHighScores();
    } else {
        gameBoard.board = localStorage.getItem('examenApisPuzzleBoard').split(",");
        playerScoreCard.score = Number(localStorage.getItem('examenApisPoints'));
        playerScoreCard.words = localStorage.getItem('examenApisCurrentWords').split(",") // need to find a way to store them that's not an array
        gameDisplay.updateHighScores();
        gameDisplay.updateScore();
    }
}

populateLocalStorageOnPageLoad();

function Board () {
    return {
        board: [],
        generateBoard () {
            this.resetBoard();
            const letters = "aaabcdeeeefghiiilmnoopqrstuuuv"
            for (i = 0; i < 7; i++) {
                let generatedLetter = letters.charAt(Math.floor(Math.random() * letters.length));
                while (this.board.includes(generatedLetter)) {
                    generatedLetter = letters.charAt(Math.floor(Math.random() * letters.length));
                } 
                this.board.push(generatedLetter);
            }
        },
        resetBoard () {
            for (i = 0; i < 7; i++) {
                this.board.pop();
            }
        }
    }
}





const keys = document.querySelectorAll('.hexagon');
keys.forEach(key => key.addEventListener('click', gameDisplay.inputLetterFromButton));

gameDisplay.populateDisplay();
const refreshButton = document.querySelector("#refresh-button");
refreshButton.addEventListener("click", gameDisplay.shuffleDisplay.bind(gameDisplay));
const rulesOpenButton = document.querySelector(".fa-circle-info");
rulesOpenButton.addEventListener('click', gameDisplay.showRules);
const rulesCloseButton = document.querySelector(".rules-button");
rulesCloseButton.addEventListener('click', gameDisplay.hideRules);
const highScoreOpenButton = document.querySelector("#high-scores-button");
highScoreOpenButton.addEventListener('click', gameDisplay.showHighScores.bind(gameDisplay));
const highScoreCloseButton = document.querySelector(".scores-button");
highScoreCloseButton.addEventListener('click', gameDisplay.hideHighScores);


let isCurrentPlayValid;

function playWord () {
    const inputtedWord = document.querySelector('input').value.toLowerCase();
    let errorTextContainer = document.querySelector('.error-text')
    clearGuess();
    if (!checkIfWordLongEnough(inputtedWord)) {
        errorTextContainer.innerText = "Word too short! Your word should be 4 or more letters long. Try again.";
        return;
    } else if (!checkIfUsesOneRequiredLetter(inputtedWord)) {
        errorTextContainer.innerText = "Your word does not use the yellow center letter. Try again";
        return;
    } else if (!checkIfAllLettersAllowed(inputtedWord)) {
        errorTextContainer.innerText = "One or more of your letters aren't on the gameboard. Check the board and try again.";
        return;
    } else if (checkIfWordAleadyPlayed(inputtedWord)) {
        errorTextContainer.innerText = "You already played that word! Try again.";
        return;
    } else {
        checkIfLatinWord(inputtedWord).then(() => {
            console.log(isCurrentPlayValid);
            if (!isCurrentPlayValid) {
                errorTextContainer.innerText = "That is not a valid Latin word! Try again.";
                return;
            } else {
                errorTextContainer.innerText = "";
                playerScoreCard.words.push(inputtedWord);
                playerScoreCard.score += scoreWord(inputtedWord);    
                gameDisplay.updateScore();
                updateHighScores();
                gameDisplay.updateHighScores();
                updatePlayerScoreCardLocalStorage();
            }
        })
    }  
}

async function checkIfLatinWord (str) {
    try {
        const response = await fetch(`https://gtfo-cors--timmy_i_chen.repl.co/get?url=https://latinwordnet.exeter.ac.uk/lemmatize/${str}`)
        const word = await response.json();
        isCurrentPlayValid = Boolean (word.length);
    }
    catch (err) {
        console.log(`error ${err}`);
    } 
};

function checkIfWordAleadyPlayed (word) {
    return playerScoreCard.words.includes(word)
}

function checkIfWordLongEnough (word) {
    return word.length >= 4
};

function checkIfUsesOneRequiredLetter (word) {
    return word.toLowerCase().includes(gameBoard.board[0])
}

function checkIfAllLettersAllowed (word) {
    const wordArray = word.split("");
    for (i = 0; i < wordArray.length; i++) {
        if (!gameBoard.board.includes(wordArray[i])) {
            return false; 
        } 
    }
    return true;
}

function checkPangram (str, arr) {
    if (str.length !== arr.length) {
        return false
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let arrNormalized  = arr.sort().join("");

    return strNormalized === arrNormalized
}

function scoreWord (word) { 
    if (word.length === 4) {
        return 1
    } else if (checkPangram(word, gameBoard.board)) {
        return 14
    } else if (word.length > 4) {
        return word.length
    }
}

function clearGuess () {
    document.querySelector('input').value = ""; 
}

function updateHighScores () {
    if (playerScoreCard.score > Number(localStorage.getItem('examenApisHighScore'))) {
        localStorage.setItem('examenApisHighScore', `${playerScoreCard.score}`);
    }
    playerScoreCard.words.forEach((word) => {
        if (word.length > Number(localStorage.getItem('examenApisLongestWord'))) {
            localStorage.setItem('examenApisLongestWord', `${word.length}`)
        }
    })
}

function updatePlayerScoreCardLocalStorage () {
    localStorage.setItem('examenApisCurrentWords', `${playerScoreCard.words.join(",")}`)
    localStorage.setItem('examenApisPoints', `${playerScoreCard.score}`)
}