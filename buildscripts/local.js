//locally run the scrape and save the results to a file

const fs = require("fs")
const {exec} = require("child_process");
const scrapeName = process.argv[2];
const scrapeInput = process.argv[3];

if(!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
}else {
    //delete dist folder
    fs.rmSync("tmp", { recursive: true })
    fs.mkdirSync("tmp")
}

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

const localRunner = fs.readFileSync("buildscripts/templates/runner.js", "utf8");

const browserLocal = fs.readFileSync("buildscripts/templates/browser_local.js", "utf8");


var templateScrape = fs.readFileSync("buildscripts/templates/buildScrape.js", "utf8");
templateScrape = templateScrape.replace("//<code>", scrapeCode)
templateScrape = templateScrape.replace("//<browserinitcode>", browserLocal)



fs.writeFileSync(`tmp/localscrape.js`, templateScrape, (err) => {})
fs.writeFileSync(`tmp/runner.js`, localRunner, (err) => {})

//run the scrape
exec(`node tmp/runner.js ${scrapeName} ${scrapeInput}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});




console.log(templateScrape)