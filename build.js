const fs = require("fs")
const esprima = require("esprima");

console.log("building scrappers with lambda")

if(!fs.existsSync("./dist")){
    fs.mkdirSync("./dist")
}

const allScrapeFiles = fs.readdirSync("./scrapes")


const allScrapeDetails = [];


allScrapeFiles.forEach((sf)=>{
    const scrapeName = sf.split(".js")[0]
    const ScrapeDetails = {
        name:scrapeName,
        friendlyName:null,
        rootUrl: null,
        description: null,
        creation:null,
        type:null,
        groupid:null,
        runnerConfig:{}
    }
    const d = fs.readFileSync(`./scrapes/${sf}`, "utf8")
    const parsed =esprima.parseModule(d);

    fs.writeFile("parsed.json",JSON.stringify(parsed,null,2),(err)=>{})

    parsed.body.forEach((b)=>{
        if(b.kind == "const"){
            const varName = b.declarations[0].id.name;
            switch(varName){
                case "FRIENDLYNAME":
                    ScrapeDetails.friendlyName = b.declarations[0].init.value;
                    break;
                case "ROOTURL":
                    ScrapeDetails.rootUrl = b.declarations[0].init.value;
                    break;
                case "DESCRIPTION":
                    ScrapeDetails.description = b.declarations[0].init.value;
                    break;
                case "DATEOFCREATION":
                    ScrapeDetails.creation = b.declarations[0].init.value;
                    break;
                case "TYPE":
                    ScrapeDetails.type = b.declarations[0].init.value;
                    break;

                case "GROUPID":
                    ScrapeDetails.groupid = b.declarations[0].init.value;
                    break;
                case "SCRAPERUNCONFIG":

                    b.declarations[0].init.properties.forEach((p)=>{
                        console.log(p.key.name)
                        const type = p.value.type;

                        switch(type){
                            case "Literal":
                                ScrapeDetails.runnerConfig[p.key.name] = p.value.value;
                                break;
                            case "ArrayExpression":
                                ScrapeDetails.runnerConfig[p.key.name] = p.value.elements.map((e)=>e.value);
                                break;
                        }
                    })

                    fs.writeFileSync("ss.json",JSON.stringify(b,null,2),(err)=>{})
                    break;


            }

        }
    })

   allScrapeDetails.push(ScrapeDetails)

    // console.log(scrapeName);
})

fs.writeFileSync("./dist/scrapes.json",JSON.stringify(allScrapeDetails,null,2),(err)=>{})


//console.log(allScrapeDetails);