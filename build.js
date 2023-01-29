const fs = require("fs")
const esprima = require("esprima");

console.log("building scrappers with lambda")

if(!fs.existsSync("./dist")){
    fs.mkdirSync("./dist")
}

const allScrapeFiles = fs.readdirSync("./scrapes")


const allScrapeDetails = [];


allScrapeFiles.forEach((sf)=>{
    const scrapeType = sf.split(".js")[0]

    const cfiles = fs.readdirSync(`./scrapes/${scrapeType}`)

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
            runnerConfig:{}
        }

        const d = fs.readFileSync(`./scrapes/${scrapeType}/${sf2}`, "utf8")
        const parsed =esprima.parseModule(d);

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
                                    ScrapeDetail.runnerConfig[p.key.name] = p.value.elements.map((e)=>e.value);
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
    if(!fs.existsSync(`./dist/${scrape.name}`)){
        fs.mkdirSync(`./dist/${scrape.name}`)
    }

    const pjson = JSON.parse(fs.readFileSync('./templates/package.json', "utf8"));
    pjson.name = scrape.name;
    pjson.zip = `zip -r ${scrape.name}.zip s3://scrapes69/${scrape.name}.zip`
    fs.writeFileSync(`./dist/${scrape.name}/package.json`,JSON.stringify(pjson,null,2),(err)=>{})

    const indexjs = fs.readFileSync(`./scrapes/${scrape.scrapeCategory}/${scrape.file}`, "utf8");
    fs.writeFileSync(`./dist/${scrape.name}/index.js`,indexjs,(err)=>{})

}


allScrapeDetails.forEach((scrape)=>{
    buildForLambda(scrape)
})



fs.writeFileSync("./dist/scrapes.json",JSON.stringify(allScrapeDetails,null,2),(err)=>{})


//console.log(allScrapeDetails);