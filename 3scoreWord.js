const fs = require('fs')
const path = require('path')

const checkIfPangram = (str, gameBoard) => {
    if (str.length !== gameBoard.length) {
      return false;
    }
    let strNormalized = str.toLowerCase().split("").sort().join("");
    let gameBoardNormalized = [...gameBoard].sort().join("");
    return strNormalized === gameBoardNormalized;
  };

  const scoreWord = (word, gameBoard) => {
    if (word.length === 4) {
      return 1;
    } else if (checkIfPangram(word, gameBoard)) {
      return 14;
    } else if (word.length > 4) {
      return word.length;
    }
  };

  const removeCommas = (str) => {
    if (str[0] === ",") {
      str = str.slice(1);
    } 
    if (str[str.length - 1] === ",") {
      str = str.slice(0, -1);
    }
    return str
  }

  const removeShortWords = (str) => {
    console.log(str)
    const strArray = str.split(",");
    return strArray.filter(x => x.length > 3).join(",")
  }

  const scoreWords = (words, gameBoard) => {
    const wordsArray = words.split(",")
    const WordsArrayScored = wordsArray.map(word => word + `:${scoreWord(word, gameBoard)}`)
    return WordsArrayScored.join(",")
  }

  const filePath = __dirname + '/solutions/cleaned/';
  
  (async () => {
      try {
          // Get the files as an array
          const files = await fs.promises.readdir( filePath );
          // const stream = fs.createWriteStream(moveTo, {flags:'a'}); // write to a file name that's the same as the original
  
          for( const file of files ) {
              // Get the full paths
              const gameBoard = file.slice(0, -4).split("")              
              const fromFile = path.join( filePath, file );
              let returnedData = fs.readFileSync(fromFile, 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                } 
                return data;
              })
              let commalessData = removeCommas(returnedData)
              let shortWordlessData = removeShortWords(commalessData)
              let scoredWords = scoreWords(shortWordlessData, gameBoard);
              fs.writeFile(fromFile, scoredWords, err => {
                if (err) {
                    console.log(err)
                }
              })
        }
      }
      catch( e ) {
          console.error( "We've thrown! Whoops!", e );
      }
  })();


  //module.exports = {scoreWord}