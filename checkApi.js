const fs = require('fs');
const axios = require('axios');

async function filterLatinWords (words) {
    for (const word of words) {
      axios
      .get(`https://latinwordnet.exeter.ac.uk/lemmatize/${word}`)
      .then(res => {
        let headerLength = res.headers['content-length']
         if (headerLength > 2) {
            console.log(word + 'is allowed!')
            allowedGuesses.push(word) // in the final code, actually set a key for each word in the json object equal to 0
         } // this is working but how to return it???
      })
      .catch(error => {
          console.error(error);
      });
    }

}

// read the file (CSV), make it an array, pass it to filterLatinWords, then 