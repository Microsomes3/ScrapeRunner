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

var localRunner = fs.readFileSync("buildscripts/templates/runner.js", "utf8");

const browserLocal = fs.readFileSync("buildscripts/templates/browser_local.js", "utf8");


var templateScrape = fs.readFileSync("buildscripts/templates/buildScrape.js", "utf8");
templateScrape = templateScrape.replace("//<code>", scrapeCode)
templateScrape = templateScrape.replace("//<browserinitcode>", browserLocal)

templateScrape = templateScrape.replace("//<import1>", "const puppeteer = require('puppeteer');")
templateScrape=templateScrape.replace("//<const>","const url ='"+scrape.rootUrl+"' ")
templateScrape = templateScrape.replace("//<scrapeconfig>",`const scrapeConfig = ${JSON.stringify(scrape,null,2)}`)

const input = scrape.runnerConfig.inputs[scrapeInput]

localRunner = localRunner.replace("//<input>",`const input = ${JSON.stringify(input,null,2)}`)
localRunner = localRunner.replace("const input =","")



var pjson = JSON.parse(fs.readFileSync("package.json", "utf8"));

pjson.scripts = {
    "docker": "docker build -t local-scrape .",
    "run":"docker run local-scrape"
}


const dockerTemp = fs.readFileSync("buildscripts/templates/docker_local", "utf8");

fs.writeFileSync(`tmp/Dockerfile`, dockerTemp, (err) => {})

fs.writeFileSync(`tmp/package.json`, JSON.stringify(pjson,null,2), (err) => {})

fs.writeFileSync(`tmp/localscrape.js`, templateScrape, (err) => {})
fs.writeFileSync(`tmp/runner.js`, localRunner, (err) => {})


// //run the scrape
// exec(`node tmp/runner.js ${scrapeName} ${scrapeInput}`, (error, stdout, stderr) => {
//   console.log(stdout)
// });

console.log("executing docker command");

exec(`cd tmp && npm run docker`, (error, stdout, stderr) => {
    console.log(stdout,error)
});


exec("cd tmp && npm run run",(error,stdout,stderr)=>{
    console.log(stdout);
})



