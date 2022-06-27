//dataset improved - don't really need this anymore
const fs = require('fs');
const axios = require('axios');
const path = require('path')

async function checkApi (words) {
  const allowedGuesses = [];
    for (const word of words) {
      console.log(word)
      await axios
      .get(`https://latinwordnet.exeter.ac.uk/lemmatize/${word}`)
      .then(res => {
        let headerLength = res.headers['content-length']
         if (headerLength > 2) {
            console.log(word + ' is allowed!')
            allowedGuesses.push(word) // in the final code, actually set a key for each word in the json object equal to 0
         } // this is working but how to return it???
      })
      .catch(error => {
          console.error(error);
      });
    }
    console.log('Allowed guesses are:' + allowedGuesses)
    return allowedGuesses
}

function getUniqueData (data) {
  return data.split(',').filter((item, i, allItems) => {
    return i === allItems.indexOf(item);
  }).join(' ')
} 

const moveFrom = __dirname + '/solutions/uncleaned';
const moveTo = __dirname + '/solutions/cleaned';

(async () => {
    try {
        // Get the files as an array
        const files = await fs.promises.readdir( moveFrom );
        const stream = fs.createWriteStream(moveTo + "allData.txt", {flags:'a'});

        for( const file of files ) {
            // Get the full paths
            const fromPath = path.join( moveFrom, file );
            let returnedData = fs.readFileSync(fromPath, 'utf8', (err, data) => {
              if (err) {
                console.error(err);
                return;
              } 
              return data;
            })
           
            let uniqueData = getUniqueData(returnedData);
            let validatedLatinWords = await checkApi(uniqueData.split(" "))
            validatedLatinWords = validatedLatinWords.join(",")
            stream.write(validatedLatinWords);
        } 
        stream.end();
    }
    catch( e ) {
        console.error( "We've thrown! Whoops!", e );
    }
})();

/*
let returnedData = fs.readFileSync('/Users/alexandravining/Desktop/examen_apium_txt_files/cleanedallData.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  } 
  return data;
})

let uniqueData = getUniqueData(returnedData);

fs.writeFile("/Users/alexandravining/Desktop/examen_apium_txt_files/allUniqueData.txt", uniqueData, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    console.log(fs.readFileSync("/Users/alexandravining/Desktop/examen_apium_txt_files/allUniqueData.txt", "utf8"));
  }
});*/