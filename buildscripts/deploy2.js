require("dotenv").config();
const aws = require('aws-sdk');
const fs = require("fs");
const { exec } = require("child_process");

var scrapeNameSelected = process.argv[2];
const selectedBuild = scrapeNameSelected != undefined ? scrapeNameSelected : "all";


async function checkLambdaFunctionExists(name) {
    return new Promise((resolve, reject) => {
        const lambda = new aws.Lambda({
            region: process.env.AWS_REGION
        });
        lambda.getFunction({
            FunctionName: name
        }, (err, data) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

async function createLambda(name, scrape) {
    return new Promise((resolve, reject) => {
        const lambda = new aws.Lambda({
            region: process.env.AWS_REGION
        });

        const params = {
            Code: {
                S3Bucket: 'scrapes69',
                S3Key: scrape.name + '.zip'
            },
            FunctionName: name,
            Handler: 'index.handler',
            Role: 'arn:aws:iam::574134043875:role/LamdaDynamo',
            Runtime: 'nodejs14.x',
            Timeout: scrape.runnerConfig.resourceControl.timeout,
            MemorySize: scrape.runnerConfig.resourceControl.memory,
            Publish: true
        };

        lambda.createFunction(params, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });

    })
}

function updateLambda(name, scrape) {
    return new Promise(async (resolve, reject) => {
        const lambda = new aws.Lambda({
            region: process.env.AWS_REGION
        });

        const params = {
            S3Bucket: process.env.AWS_BUCKET_NAME,
            S3Key: scrape.name + '.zip',
            FunctionName: name,
            Publish: true,
        };

        await 

        //update timeout and memory size
        lambda.updateFunctionConfiguration({
            FunctionName: name,
            Timeout: 900,
            MemorySize: 1500
        }, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });

        lambda.updateFunctionCode(params, function (err, data) {
            console.log(data)
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });

    })
}

function runZip(scrape) {
    return new Promise((resolve, reject) => {
        exec(`cd dist/${scrape.name} && npm run zip`, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })
    })
}

function uploadFunctionS3(scrape) {
    return new Promise((resolve, reject) => {
        exec(`cd dist/${scrape.name} && npm run upload`, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })
    })
}

function scanForScrape(name) {
    const allScrapesFound = [];
    const allScrapeCategories = fs.readdirSync("scrapes");
    allScrapeCategories.forEach((sc) => {
        const allScrapes = fs.readdirSync(`scrapes/${sc}`);
        allScrapes.forEach((s) => {

            if(name == "all"){
                allScrapesFound.push({
                    category: sc,
                    file: s
                })
            }
            
            else
            if (s.split(".js")[0] == name && name !== "all") {
                allScrapesFound.push({
                    category: sc,
                    file: s
                })
            }
        })
    })

    if (allScrapesFound.length == 0) {
        return null;
    }

    return allScrapesFound;
}


async function deployScrape(scrapeConfig) {
return new Promise(async (resolve,reject)=>{
    await runZip(scrapeConfig);
})
}

(async ()=>{
    console.log("building scrape:",selectedBuild)

    if(selectedBuild !== "all"){
        console.log("building specific scrape")
        const scrape = scanForScrape(selectedBuild);
        if(scrape == null){
            console.log("scrape not found")
            return;
        }

        const scrapeDetails =  JSON.parse(fs.readFileSync(`dist/${scrape[0].file.split(".js")[0]}/scrape_details.json`, "utf8"));
        await deployScrape(scrapeDetails);
    
        return;
    }



})();