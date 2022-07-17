// This file is used to generate Latin word lists from text I pull from various sources (primarily Latin Library / Perseus Tufts).

const fs = require('fs');
const path = require( 'path' );

function cleanData (data) {
  return data.replace(/[.,\/#!$?%'\^&\*;:{}\"\"<>[\]=\-_`~()]/g,"")
      .replace(/([A-Z])\w+/g,"")
      .replace(/([A-Z])/g,"")
      .replace(/\b\w{1,3}\b/g, "")
      .replace(/\s\s+/g, ' ');
}

function getUniqueData (data) {
  return data.split(' ').filter((item, i, allItems) => {
    return i === allItems.indexOf(item);
  }).join(' ')
} 

const moveFrom = __dirname + '/latin_text_files/uncleaned';
const moveTo = __dirname + '/latin_text_files/cleaned';

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
           
            let cleanedData = cleanData(returnedData);
            let uniqueData = getUniqueData(cleanedData);
            
            stream.write(uniqueData);
        } 
        stream.end();
    }
    catch( e ) {
        console.error( "We've thrown! Whoops!", e );
    }
})();


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
});