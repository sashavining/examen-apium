const GameBoard = require('./gameBoard.js');
const fs = require('fs');
const axios = require('axios');
// import scoreword

const board1 = new GameBoard
board1.generateBoard()
console.log(board1.board.join(""))

const boardForServer = {board: board1.board}
let allowedLettersRegEx = new RegExp(`^[${board1.board.join("")}]+\$`, "g");
let requiredLetterRegEx = new RegExp(`^[${board1.board[0]}]+`, "g");


function checkWord (word, allowedLetters, requiredLetter) {
    return Boolean(word.match(allowedLetters)) && Boolean(word.match(requiredLetter))
}

const runningGuesses = [];
const allowedGuesses = [];

let readerStream = fs.createReadStream(__dirname + '/latinWords.txt', 'utf8'); 
let writeStream = fs.createWriteStream(__dirname + `/solutions/uncleaned/${board1.board.join("")}.txt`) // can you write to json?

readerStream.on('data', (chunk) => {
   let chunkToCheck = chunk.split(/[\n^\W]+/)
   let wordMatches = chunkToCheck.filter(word => checkWord(word, allowedLettersRegEx, requiredLetterRegEx)).join(",")
   writeStream.write(wordMatches + ",")
});

readerStream.on('end', () => {
   console.log("Done!");
})

readerStream.on('error', (err) => {
   console.log(err.stack);
});

