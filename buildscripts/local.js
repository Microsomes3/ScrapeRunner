//locally run the scrape and save the results to a file

const fs = require("fs")
const scrapeName = process.argv[2];
const scrapeInput = process.argv[3];

const allScrapes = JSON.parse(fs.readFileSync("dist/scrapes.json"));

const scrape = allScrapes.find((s) => {
    return s.name === scrapeName;
})

if (scrape == undefined) {
    console.log("scrape not found")
    return;
}

var scrapeCode = fs.readFileSync(`scrapes/news/liveuamap.js`, "utf8").split("exports.handler = async (event,opt)=>{//<<do not change this line")[1];
const totalLine = scrapeCode.split("\n").length;
const lines = scrapeCode.split("\n").slice(0, totalLine - 1).join("\n");
scrapeCode = lines;


console.log(scrapeCode)