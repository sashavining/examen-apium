document.querySelector('button').addEventListener('click', playWord);

function Board () {
    return {
        board: [],
        generateBoard () {
            this.resetBoard();
            const letters = "abcdefghilmnopqrstuvyz"
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

let gameBoard = new Board;
gameBoard.generateBoard();

const playerScoreCard = {
    words: [],
    score: 0,
}

const gameDisplay = {
    // add DOM elements
}

function playWord () {
    const inputtedWord = document.querySelector('input').value;
    if (!checkIfWordLongEnough(inputtedWord)) {
        alert ("Word too short! Try again!")
        clearGuess();
        return;
    } else if (!checkIfUsesOneRequiredLetter(inputtedWord)) {
        alert("Oops! Your word does not use the required center letter. Try again.");
        clearGuess();
        return;
    } else if (!checkIfAllLettersAllowed(inputtedWord)) {
        alert("Oops! One or more of your letters aren't on the board. Try again.");
        clearGuess();
        return;
    } else if (checkIfWordAleadyPlayed(inputtedWord)) {
        alert ("You already played that word! Try again.");
        clearGuess();
        return;
    } else if (!checkIfLatinWord(inputtedWord)) {
        alert ("Not a Latin word! Try again!");
        clearGuess();
        return;
    } 
    playerScoreCard.words.push(inputtedWord);
    playerScoreCard.score += scoreWord(inputtedWord);
    // update score on DOM
    // update word on DOM
}

async function checkIfLatinWord (str) {
    try {
        const response = await fetch(`https://gtfo-cors--timmy_i_chen.repl.co/get?url=https://latinwordnet.exeter.ac.uk/lemmatize/${str}`)
        const word = await response.json();
        return Boolean (word.length);
    }
    catch (err) {
        console.log(`error ${err}`);
    } 
};
function checkIfWordAleadyPlayed (word) {
    return playerScoreCard.words.includes(word)
}

function checkIfWordLongEnough (word) {
    return word.length > 4
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
    document.querySelector('input').innerText = ""; // doesn't work
}

// function displayWord () { }

// function displayScore () { }

// need to clear input once player has guessed
