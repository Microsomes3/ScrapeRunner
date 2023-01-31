//file will invoke the lambda function specified
const fs = require("fs")
const scrapeName = process.argv[2];
const scrapeInput = process.argv[3];

console.log({
    scrapeName,
    scrapeInput
})

const allScrapes = JSON.parse(fs.readFileSync("dist/scrapes.json"));

const scrape = allScrapes.find((s)=>{
    return s.name === scrapeName;
})

if(scrape == undefined){
    console.log("scrape not found")
    return;
}


console.log(scrape)