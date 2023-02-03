require("dotenv").config();
const fs = require("fs")
const esprima = require("esprima");
const AWS = require("aws-sdk");
const { exec } = require("child_process");

var scrapeNameSelected = process.argv[2];
const selectedBuild = scrapeNameSelected != undefined ? scrapeNameSelected : "all";

async function checkDist() {
    if (!fs.existsSync("dist")) {
        fs.mkdirSync("dist")
    } 
}

async function processLib() {
    return new Promise((resolve,reject)=>{
    fs.mkdirSync("dist/lib");
    const pfile = JSON.parse(fs.readFileSync("buildscripts/templates/package.json", "utf8"));
    fs.writeFileSync("dist/lib/package.json", JSON.stringify(pfile, null, 2), (err) => { })
    exec(`cd dist/lib && npm install`, (error, stdout, stderr) => {
        if (error) {
            reject(error)
        } else {
            resolve()
        }
    });          
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

async function parseScrapeDetailsFromCode(codetxt) {
    const parsed =esprima.parseModule(codetxt);

    const ScrapeDetail = {
        friendlyName:null,
        rootUrl: null,
        description: null,
        creation:null,
        type:null,
        groupid:null,
        runnerConfig:{}
    }

    parsed.body.forEach((b)=>{
        if(b.kind == "const"){
            const varName = b.declarations[0].id.name;
            switch(varName){
                case "FRIENDLYNAME":
                    ScrapeDetail.friendlyName = b.declarations[0].init.value;
                    break;
                case "ROOTURL":
                    ScrapeDetail.rootUrl = b.declarations[0].init.value;
                    break;
                case "DESCRIPTION":
                    ScrapeDetail.description = b.declarations[0].init.value;
                    break;
                case "DATEOFCREATION":
                    ScrapeDetail.creation = b.declarations[0].init.value;
                    break;
                case "TYPE":
                    ScrapeDetail.type = b.declarations[0].init.value;
                    break;
                case "GROUPID":
                    ScrapeDetail.groupid = b.declarations[0].init.value;
                    break;
                case "SCRAPERUNCONFIG":
                    b.declarations[0].init.properties.forEach((p)=>{
                        const type = p.value.type;
                        switch(type){
                            case "ObjectExpression":
                                const obj = {};
                                p.value.properties.forEach((p)=>{
                                    obj[p.key.value] = p.value.value;
                                })
                                ScrapeDetail.runnerConfig[p.key.name] = obj;
                                break;
                            case "Literal":
                                ScrapeDetail.runnerConfig[p.key.name] = p.value.value;
                                break;
                            case "ArrayExpression":
                                fs.writeFileSync("p.json",JSON.stringify(p,null,2),(err)=>{});

                                const key = p.key.name;
                                const type = p.value.type;

                                ScrapeDetail.runnerConfig[key] = [];

                                p.value.elements.forEach(e=>{
                                    const etype = e.type;
                                    switch(e.type){
                                        case "Literal":
                                            ScrapeDetail.runnerConfig[key].push(e.value);
                                            break;
                                        case "ObjectExpression":
                                            const obj = {};
                                            e.properties.forEach((p)=>{
                                                obj[p.key.value] = p.value.value;
                                            })
                                           
                                            ScrapeDetail.runnerConfig[key].push(obj);
                                            break;
                                    }
                                })
                                break;
                        }
                    })
                    break;
            }
        }
    })

    return ScrapeDetail;
}

async function buildScrape(name, category) {
    const ScrapeDetail = {
        name:name.split(".js")[0],
        file:name,
        scrapeCategory:category,
        friendlyName:null,
        rootUrl: null,
        description: null,
        creation:null,
        type:null,
        groupid:null,
        runnerConfig:{},
        filetxt:null,
    }

    const scrapeFile = fs.readFileSync(`scrapes/${category}/${name}`, "utf8");
    const scrapeConsts = await parseScrapeDetailsFromCode(scrapeFile);
    ScrapeDetail.filetxt = scrapeFile;

    //merge scrape consts
    Object.keys(scrapeConsts).forEach((k)=>{
        ScrapeDetail[k] = scrapeConsts[k];
    })

    return ScrapeDetail;
}

async function createPublicRegistry(name) {
    return new Promise((resolve, reject) => {


        const dockerRegistry = new AWS.ECR({
            region: process.env.AWS_REGION
        });

        const createRepo = (name) => {
            const params = {
                repositoryName: name + "_generated",
                imageTagMutability: "MUTABLE"
            };

            dockerRegistry.createRepository(params).promise().then((data) => {
                resolve(data.repository.repositoryUri)
            }).catch((err) => {
                reject(err)
            })
        }

        const findRepo = (name) => {
            const params = {
                repositoryNames: [
                    name + "_generated"
                ]
            };

            dockerRegistry.describeRepositories(params, (err, data) => {
                if (err) {
                    if (err.code == "RepositoryNotFoundException") {
                        createRepo(name)
                    } else {
                        reject(err)
                    }
                } else {
                    resolve(data.repositories[0].repositoryUri)
                }
            });
        }


        findRepo(name)
    })
}

async function buildForLambda(scrape) {
    if (!fs.existsSync(`dist/${scrape.name}`)) {
        fs.mkdirSync(`dist/${scrape.name}`)
    }


    const dockerUri = await createPublicRegistry(scrape.name);

    const pjson = JSON.parse(fs.readFileSync('buildscripts/templates/package.json', "utf8"));
    pjson.name = scrape.name;
    pjson.scripts.zip = `zip -r ${scrape.name}.zip ./*`
    pjson.scripts.upload = `aws s3 cp ${scrape.name}.zip s3://${process.env.AWS_BUCKET_NAME}/${scrape.name}.zip`
    pjson.scripts.docker = `docker build -t ${scrape.name}_generated .`
    pjson.scripts.dockerpush = `docker tag bbcnews_generated:latest ${dockerUri}:latest && docker push ${dockerUri}:latest`

    //if package.json exists delete it
    if (fs.existsSync(`dist/${scrape.name}/package.json`)) {
        fs.unlinkSync(`dist/${scrape.name}/package.json`)
    }
    fs.writeFileSync(`dist/${scrape.name}/package.json`, JSON.stringify(pjson, null, 2), (err) => { })

    const scrapeFile = fs.readFileSync(`scrapes/${scrape.scrapeCategory}/${scrape.file}`, "utf8");
    var buildFile = fs.readFileSync(`buildscripts/templates/buildScrape.js`, "utf8");


    //make all scrape config vars
    buildFile = buildFile.replace("//<scrapeconfig>", `const scrapeConfig = ${JSON.stringify(scrape, null, 2)}`)

    buildFile = buildFile.replace("//<const>", "const url ='" + scrape.rootUrl + "' ")

    if (scrape.runnerConfig.isBrowser) {
        buildFile = buildFile.replace("//<import1>", "const chromium = require('chrome-aws-lambda');");
    }

    if (scrape.runnerConfig.isAxios) {
        buildFile = buildFile.replace("//<import2>", "const axios = require('axios');");
    }

    const browserTemplateInit = fs.readFileSync("buildscripts/templates/index_with_browser.js", "utf8");


    buildFile = buildFile.replace("//<browserinitcode>", browserTemplateInit)


    console.log("-----------");

    var ccode = scrapeFile.split("exports.handler = async (event,opt)=>{")[1];

    //remove the last line
    const totalLine = ccode.split("\n").length;

    console.log(totalLine)

    //remove the last line
    const lines = ccode.split("\n").slice(0, totalLine - 1).join("\n");

    ccode = lines;

    buildFile = buildFile.replace("//<code>", ccode)

    fs.writeFileSync(`dist/${scrape.name}/index.js`, buildFile, (err) => { })

    const dockerTemplate = fs.readFileSync("buildscripts/templates/docker_prod", "utf8");
    fs.writeFileSync(`dist/${scrape.name}/Dockerfile`, dockerTemplate, (err) => { })

    exec(`cd dist/${scrape.name} && npm install`, (error, stdout, stderr) => {
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
}


(async () => {
    await checkDist();
    // await processLib();

    if (selectedBuild !== "all") {
        console.log("scanning for scrape: " + selectedBuild)
        const foundScrape = scanForScrape(selectedBuild)[0];
        if (foundScrape == null) {
            console.log("scrape not found")
        } else {
            console.log("scrape found: " + foundScrape.file)
           const scrapeDetail =  await buildScrape(foundScrape.file, foundScrape.category);
            await buildForLambda(scrapeDetail);
        }
        return;
    }else{
        const allScrapes = scanForScrape("all");

        const allS = [];

        for (let i = 0; i < allScrapes.length; i++) {
            const scrapeDetail = await buildScrape(allScrapes[i].file, allScrapes[i].category);
            allS.push(scrapeDetail);
            await buildForLambda(scrapeDetail);
        }

        fs.writeFileSync(`dist/scrapes.json`, JSON.stringify(allS, null, 2), (err) => { })


    }
})();