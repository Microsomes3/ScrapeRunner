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

function changeLambdaConfig(name,scrapeRunnerConfig){
    return new Promise((resolve,reject)=>{
        console.log("modifying lambda config")
        console.log(name,scrapeRunnerConfig.resourceControl.timeout);
        console.log(name,scrapeRunnerConfig.resourceControl.memory);
        const lambda = new aws.Lambda({
            region: process.env.AWS_REGION
        });

        const params = {
            FunctionName: name,
            Timeout: scrapeRunnerConfig.resourceControl.timeout,
            MemorySize: scrapeRunnerConfig.resourceControl.memory
        };

        lambda.updateFunctionConfiguration(params, function (err, data) {
            console.log(err,data)
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
            Publish: true
        };

        await changeLambdaConfig(name,scrape.runnerConfig);
        return;

        lambda.updateFunctionCode(params, function (err, data) {
            console.log(err,data)
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

            if (name == "all") {
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
    return new Promise(async (resolve, reject) => {
        console.log("deploying scrape:", scrapeConfig.name)
        if (scrapeConfig.runnerConfig.runner == "lambda") {
            await runZip(scrapeConfig);
            console.log("upload to s3")
            await uploadFunctionS3(scrapeConfig);
            const functionName = scrapeConfig.name + "_scrape_generated";

            const exists = await checkLambdaFunctionExists(functionName);
            if (exists) {
                console.log("updating lambda")
                await updateLambda(functionName, scrapeConfig);
            }else{
                console.log("creating lambda")
                await createLambda(functionName, scrapeConfig);
            }

        }else{
        }
    });
}

    (async () => {
        console.log("building scrape:", selectedBuild)

        if (selectedBuild !== "all") {
            console.log("building specific scrape")
            const scrape = scanForScrape(selectedBuild);
            if (scrape == null) {
                console.log("scrape not found")
                return;
            }

            const scrapeDetails = JSON.parse(fs.readFileSync(`dist/${scrape[0].file.split(".js")[0]}/scrape_details.json`, "utf8"));
            await deployScrape(scrapeDetails);

            return;
        }else{
            const allScrapes = scanForScrape("all");
            for (let i = 0; i < allScrapes.length; i++) {
                const scrapeDetail = JSON.parse(fs.readFileSync(`dist/${allScrapes[i].file.split(".js")[0]}/scrape_details.json`, "utf8"));
                await deployScrape(scrapeDetail);
            }
        }



    })();