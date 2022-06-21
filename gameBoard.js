//refactor so it's not an IIFE
class GameBoard {
  constructor () {
    this.letters = "aaaaaaaaabccccdddeeeeeeeeeeefghiiiiiiiiiiilllmmmmmnnnnnnooooopppqqrrrrrrrssssssssttttttttuuuuuuuuuv";
  // letter frequencies from https://www.sttmedia.com/characterfrequency-latin. Any letter that appears < 1% has been omitted
    this.board = [];
  }
  resetBoard = () => {
    for (let i = 0; i < 7; i++) {
        this.board.pop();
    }
  };
  generateBoard = () => {
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
module.exports = GameBoard;