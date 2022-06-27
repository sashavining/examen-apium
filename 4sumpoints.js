const fs = require('fs')
const path = require('path')

function sumPoints (str) {
    const strArray = str.split(/[,:]+/)
    return getOdds(strArray.map(str => +str)).reduce((acc, curr) => acc + curr, 0)
};

function getOdds (arr) {
    return arr.filter((item, index) => index % 2)
}


sumPoints("eius:1,esse:1,esses:5,eripere:7,eripiens:8,enisuri:7,eripi:5,erupisse:8,euri:1,erupere:7,ense:1,eriperes:8,euenire:7,eneruis:7,esui:1,eurus:5,esurie:6,enisus:6,eripis:6,eris:1,esurire:7,eripui:6,eripuisse:9,essene:6,erueris:7,eripueris:9,eripe:5,eriperer:8,eripuerisne:11,esne:1,eisne:5,eriperis:8,eueris:6,euisse:6,eripuisses:10,ensi:1,esuriens:8,eruere:6,enirn:5,eisi:1,eipeis:6,eureies:7,epei:1,erui:1,eupine:6,erues:5,eipein:6,essesne:7,eiures:6,ensis:5,enses:5,eripuere:8,erepi:5,eipei:5,enseiseis:9,erein:5,eipen:5,esus:1,eisin:5,erepere:7,euripis:7,erus:1,euersis:7,euenisse:8,euenere:7,euersuri:8,euripus:7,erres:5,eins:1,eripies:7,euris:5,euripi:6,enerui:6,eenses:6,essuri:6,erupui:6,essu:1,essurus:7,essuries:8,essurire:8,eine:1,esuri:5,einen:5,esurisse:8,erueres:7,erue:1,essein:6,enisi:5,eruisses:8,eripereei:9,esurus:6,ensesue:7,eruis:5,enerues:7,errein:6,eeis:1,epiri:5");

 const filePath = __dirname + '/solutions/cleaned/';
  
(async () => {
      try {
          // Get the files as an array
          const files = await fs.promises.readdir( filePath );
          // const stream = fs.createWriteStream(moveTo, {flags:'a'}); // write to a file name that's the same as the original
  
          for( const file of files ) {
              // Get the full paths
              const fromFile = path.join( filePath, file );
              let returnedData = fs.readFileSync(fromFile, 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                } 
                return data;
              })
              let totalScore = sumPoints(returnedData)
              let returnedDataScored = returnedData + `totalScore:${totalScore}`
              fs.writeFile(fromFile, returnedDataScored, err => {
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


