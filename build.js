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
        type:null
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
            }

        }
    })

    allScrapeDetails.push(ScrapeDetails)

    // console.log(scrapeName);
})


console.log(allScrapeDetails);