//Used this to change the structure of my DB from one long array in a document to individual documents for words

const fs = require('fs')

const latinwords = fs.readFileSync(__dirname + '/latinWords.json', 'utf8', function(err, data) {
    if (err) {
        console.log(err)
    } else {
        return data
    }
})

const latinwordssorted = latinwords.split(",").filter(word => word.length > 3).sort()
const arrayForJson = []

for (word of latinwordssorted) {
    arrayForJson.push({ "word": word })
}

console.log(arrayForJson)

fs.writeFile("/Users/alexandravining/repos/apis-verborum/apis-verborum/latinwordsnew.json", JSON.stringify(arrayForJson), (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("/Users/alexandravining/Desktop/examen_apium_txt_files/allUniqueData.txt", "utf8"));
    }
  });