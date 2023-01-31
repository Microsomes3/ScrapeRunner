const fs = require("fs")
const esprima = require("esprima");
const { json } = require("stream/consumers");
const AWS = require("aws-sdk");

console.log("building scrappers with lambda")


if(!fs.existsSync("dist")){
    fs.mkdirSync("dist")
}else{
    //delete dist folder
    fs.rmSync("dist", { recursive: true })
    fs.mkdirSync("dist")
    
}

fs.mkdirSync("dist/lib");

const pfile = JSON.parse(fs.readFileSync("buildscripts/templates/package.json", "utf8"));

fs.writeFileSync("dist/lib/package.json",JSON.stringify(pfile,null,2),(err)=>{})

//npm install inside the folder
const { exec } = require("child_process");

function buildLib(){
    return new Promise((resolve,reject)=>{
        exec(`cd dist/lib && npm install`, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            }else{
                resolve()
            }
            
        });
        
    });
}

(async ()=>{
    await buildLib();   
    const allScrapeFiles = fs.readdirSync("scrapes")

    const allScrapeDetails = [];
allScrapeFiles.forEach((sf)=>{
    const scrapeType = sf.split(".js")[0]

    const cfiles = fs.readdirSync(`scrapes/${scrapeType}`)

    cfiles.forEach((sf2)=>{
        const scrapeName = sf2.split(".js")[0]
        const ScrapeDetail = {
            name:scrapeName,
            file:sf2,
            scrapeCategory:scrapeType,
            friendlyName:null,
            rootUrl: null,
            description: null,
            creation:null,
            type:null,
            groupid:null,
            runnerConfig:{},
            filetxt:null,
        }

        const d = fs.readFileSync(`scrapes/${scrapeType}/${sf2}`, "utf8")
        const parsed =esprima.parseModule(d);

        ScrapeDetail.filetxt = d;

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

                                    // p.value.elements.forEach((e)=>{
                                    //     if (e.type == "Literal"){
                                    //         ScrapeDetail.runnerConfig[p.key.name].push(e.value)
                                    //     }else if(e.type == "ObjectExpression"){

                                    //         const key = e.value;

                                    //         console.log(key);
                                            
                                    //     }
                                    // })

                                    break;
                            }
                        })
                        break;
                }
            }
        })

        allScrapeDetails.push(ScrapeDetail)
    })
})

async function buildForLambda(scrape){
    if(!fs.existsSync(`dist/${scrape.name}`)){
        fs.mkdirSync(`dist/${scrape.name}`)
    }

    const pjson = JSON.parse(fs.readFileSync('buildscripts/templates/package.json', "utf8"));
    pjson.name = scrape.name;
    pjson.scripts.zip = `zip -r ${scrape.name}.zip ./*`
    pjson.scripts.upload = `aws s3 cp ${scrape.name}.zip s3://scrapes69/${scrape.name}.zip`

    //if package.json exists delete it
    if(fs.existsSync(`dist/${scrape.name}/package.json`)){
        fs.unlinkSync(`dist/${scrape.name}/package.json`)
    }
    fs.writeFileSync(`dist/${scrape.name}/package.json`,JSON.stringify(pjson,null,2),(err)=>{})

    const scrapeFile = fs.readFileSync(`scrapes/${scrape.scrapeCategory}/${scrape.file}`, "utf8");
    const buildFile = fs.readFileSync(`buildscripts/templates/buildScrape.js`, "utf8");
    fs.writeFileSync(`dist/${scrape.name}/index.js`,buildFile,(err)=>{})


    //npm install inside the folder
    const { exec } = require("child_process");
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


allScrapeDetails.forEach((scrape)=>{
    buildForLambda(scrape)
})



fs.writeFileSync("dist/scrapes.json",JSON.stringify(allScrapeDetails,null,2),(err)=>{})


})()

