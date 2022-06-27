const path = require('path')
const fs = require('fs')

function getUniqueData (data) {
    return data.split(',').filter((item, i, allItems) => {
      return i === allItems.indexOf(item);
    }).join(',')
  } 
  
  const moveFrom = __dirname + '/solutions/uncleaned';
  const moveTo = __dirname + '/solutions/cleaned/';
  
  (async () => {
      try {
          // Get the files as an array
          const files = await fs.promises.readdir( moveFrom );
          // const stream = fs.createWriteStream(moveTo, {flags:'a'}); // write to a file name that's the same as the original
  
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
              console.log(uniqueData)
              fs.writeFile(path.join(moveTo + file), uniqueData, err => {
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
  
