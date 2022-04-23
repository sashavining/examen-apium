/* requested features:
- keyboard inputs
- unsuccessful guesses
- I thought the icon to the left of the trophy was to clear what I had entered in the "Type your guess here" field.
- It occurred to me though that it'd be nice to be able to clear the info in the "Type your guess here" field.
- Also, consider crediting yourself on the page and linking to your website or wherever you'd like to direct people.
- alphabetize inputs (David)
*/
const gameBoard = new Board;

const playerScoreCard = {
    words: [],
    score: 0,
}
const gameDisplay = {
    hexagonDivNumber: ["one", "two", "three", "four", "five", "six", "seven"],

    populateBoard () {
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
            const container = document.querySelector(`.${this.hexagonDivNumber[randomNum]}`).firstChild
            container.innerText = gameBoard.board[i]
        }
    },
    updateScore () {
        const successfulGuesses = document.querySelector('.successful-guess-container');
        const playerScoreDisplays = document.querySelectorAll('.score-number');
        successfulGuesses.innerText = (playerScoreCard.words[0] === " ") ?  playerScoreCard.words.slice(1).join(`, `) : playerScoreCard.words.join(`, `);  // prevents a leading , in Safari
        playerScoreDisplays.forEach(display => {
            display.textContent = playerScoreCard.score; 
        })
    },
    alphabetizeSuccessfulGuesses () {
        const successfulGuesses = document.querySelector('.successful-guess-container');
        successfulGuesses.innerText = (playerScoreCard.words[0] === " ") ?  [...playerScoreCard.words].slice(1).sort().join(`, `) : [...playerScoreCard.words].sort().join(`, `);
    },
    clearGuess () {
        document.querySelector('input').value = ""; 
    },
    showRules () {
        this.hideHighScores();
        this.hideContact();
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
        this.hideRules();
        this.hideContact();
        const highScoresContainer = document.querySelector(".high-scores");
        highScoresContainer.removeAttribute('style', 'display:block;')
    },
    hideHighScores () {
        const highScoresContainer = document.querySelector(".high-scores");
        highScoresContainer.setAttribute('style', 'display:none;')
    },
    showContact () {
        this.hideRules();
        this.hideHighScores();
        const contactContainer = document.querySelector(".contact");
        contactContainer.removeAttribute('style', 'display:block;')
    },
    hideContact () {
        const contactContainer = document.querySelector(".contact");
        contactContainer.setAttribute('style', 'display:none;')
    }
}


function Board () {
    return {
        board: [],
        generateBoard () {
            this.resetBoard();
            const letters = "aaaaaaaaabccccdddeeeeeeeeeeefghiiiiiiiiiiilllmmmmmnnnnnnooooopppqqrrrrrrrssssssssttttttttuuuuuuuuuv"
            // letter frequencies from https://www.sttmedia.com/characterfrequency-latin. Any letter that appears < 1% has been omitted
            for (i = 0; i < 7; i++) {
                let generatedLetter = letters.charAt(Math.floor(Math.random() * letters.length));
                while (this.board.includes(generatedLetter)) {
                    generatedLetter = letters.charAt(Math.floor(Math.random() * letters.length));
                } 
                if (generatedLetter === "q" && !this.board.join("").contains("u")) {
                    if (this.board.length < 6) {
                        this.board.push(generatedLetter);
                        this.board.push("u");
                        i++
                        continue;
                    } else {
                        this.board.push(generatedLetter);
                        this.board[2] = "u";
                        continue;
                    }
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

const refreshButton = document.querySelector("#refresh-button");
refreshButton.addEventListener("click", gameDisplay.shuffleDisplay.bind(gameDisplay));
const rulesOpenButton = document.querySelector(".fa-circle-info");
rulesOpenButton.addEventListener('click', gameDisplay.showRules.bind(gameDisplay));
const rulesCloseButton = document.querySelector(".rules-button");
rulesCloseButton.addEventListener('click', gameDisplay.hideRules.bind(gameDisplay));
const highScoreOpenButton = document.querySelector("#high-scores-button");
highScoreOpenButton.addEventListener('click', gameDisplay.showHighScores.bind(gameDisplay));
const highScoreCloseButton = document.querySelector(".scores-button");
highScoreCloseButton.addEventListener('click', gameDisplay.hideHighScores.bind(gameDisplay));
const contactCloseButton = document.querySelector(".contact-button");
const contactOpenButton = document.querySelector("#contact-button");
contactOpenButton.addEventListener('click', gameDisplay.showContact.bind(gameDisplay))
contactCloseButton.addEventListener('click', gameDisplay.hideContact.bind(gameDisplay))


let isCurrentPlayValid;

const gameLogic = { 
    playWord () {
        const inputtedWord = document.querySelector('input').value.toLowerCase();
        let errorTextContainer = document.querySelector('.error-text');
        gameDisplay.clearGuess();
        if (!this.checkIfWordLongEnough(inputtedWord)) {
            errorTextContainer.innerText = "Words should be at least four letters long!";
            return;
        } else if (!this.checkIfUsesOneRequiredLetter(inputtedWord)) {
            errorTextContainer.innerText = "Use the center yellow letter!";
            return;
        } else if (!this.checkIfAllLettersAllowed(inputtedWord)) {
            errorTextContainer.innerText = "Use only the letters on the gameboard!";
            return;
        } else if (this.checkIfWordAleadyPlayed(inputtedWord)) {
            errorTextContainer.innerText = "You already played that word!";
            return;
        } else {
            this.checkIfLatinWord(inputtedWord).then(() => {
                console.log(isCurrentPlayValid);
                if (!isCurrentPlayValid) {
                    errorTextContainer.innerText = "That is not a valid Latin word!";
                    return;
                } else {
                    errorTextContainer.innerText = "";
                    playerScoreCard.words.push(inputtedWord);
                    playerScoreCard.score += this.scoreWord(inputtedWord);    
                    gameDisplay.updateScore();
                    gameDisplay.updateHighScores();
                    localStorageLogic.updateHighScores();
                    localStorageLogic.updatePlayerScoreCard();
                }
            })
        }  
    },
    checkIfLatinWord: async (str) => {
        try {
            const response = await fetch(`https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${str}`, { mode: 'cors' });
            const dataOut = await response.json();
            isCurrentPlayValid = Object.keys(dataOut.RDF.Annotation).join("").includes('hasBody');
        }
        catch (err) {
            console.log(`error ${err}`);
        }
    },

    checkIfWordAleadyPlayed (word) {
        return playerScoreCard.words.includes(word)
    },

    checkIfWordLongEnough (word) {
        return word.length >= 4
    },

    checkIfUsesOneRequiredLetter (word) {
        return word.toLowerCase().includes(gameBoard.board[0])
    },
    checkIfAllLettersAllowed (word) {
    const wordArray = word.split("");
    for (i = 0; i < wordArray.length; i++) {
        if (!gameBoard.board.includes(wordArray[i])) {
            return false; 
        } 
    }
    return true;
    },

    checkIfPangram (str, arr) {
    if (str.length !== arr.length) {
        return false
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let arrNormalized  = [...arr].sort().join("");

    return strNormalized === arrNormalized
    },

    scoreWord (word) { 
    if (word.length === 4) {
        return 1
    } else if (this.checkIfPangram(word, gameBoard.board)) {
        return 14
    } else if (word.length > 4) {
        return word.length
    }
    }
}

document.querySelector('button').addEventListener('click', gameLogic.playWord.bind(gameLogic));

const localStorageLogic = {
    populateOnPageLoad () {
        const date = new Date(Date.now()).toLocaleString().split(',')[0]
        if(localStorage.getItem("examenApisLastPlayed") === null) {
            gameBoard.generateBoard();
            localStorage.setItem('examenApisLastPlayed', date);
            localStorage.setItem('examenApisPuzzleBoard', `${gameBoard.board}`);
            localStorage.setItem('examenApisPoints', '0');
            localStorage.setItem('examenApisCurrentWords', '');
            localStorage.setItem('examenApisHighScore', '0');
            localStorage.setItem('examenApisLongestWord', ' ');
            localStorage.setItem('examenApisDaysPlayed', '1');
            gameDisplay.updateHighScores();
            gameDisplay.populateBoard();
        } else if (localStorage.getItem("examenApisLastPlayed") !== date) {
            gameBoard.generateBoard();
            localStorage.setItem('examenApisLastPlayed', date);
            localStorage.setItem('examenApisPuzzleBoard', `${gameBoard.board}`);
            localStorage.setItem('examenApisPoints', '0');
            localStorage.setItem('examenApisCurrentWords', ' ');
            let currentNumOfDaysPlayed = Number(localStorage.getItem('examenApisDaysPlayed'));
            localStorage.setItem('examenApisDaysPlayed', `${currentNumOfDaysPlayed += 1}`);
            gameDisplay.updateHighScores();
            gameDisplay.populateBoard();
        } else {
            gameBoard.board = localStorage.getItem('examenApisPuzzleBoard').split(",");
            playerScoreCard.score = Number(localStorage.getItem('examenApisPoints'));
            playerScoreCard.words = localStorage.getItem('examenApisCurrentWords').split(`, `) 
            localStorageLogic.updateHighScores();
            gameDisplay.updateHighScores();
            gameDisplay.populateBoard();
            gameDisplay.updateScore();
        }
    },
    updateHighScores () {
        if (playerScoreCard.score > Number(localStorage.getItem('examenApisHighScore'))) {
            localStorage.setItem('examenApisHighScore', `${playerScoreCard.score}`);
        }
        playerScoreCard.words.forEach((word) => {
            if (word.length > Number(localStorage.getItem('examenApisLongestWord'))) {
                localStorage.setItem('examenApisLongestWord', `${word.length}`)
            }
        })
    },
    updatePlayerScoreCard () {
        localStorage.setItem('examenApisCurrentWords', `${playerScoreCard.words.join(`, `)}`)
        localStorage.setItem('examenApisPoints', `${playerScoreCard.score}`)
    }    
}

localStorageLogic.populateOnPageLoad();



