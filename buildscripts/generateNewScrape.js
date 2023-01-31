//responsible for generating a new scrape
const fs = require('fs');
const { exit } = require('process');
const readLine = require('readline');

//ask user for name of scrape

const readl= readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

var nameOfScrape = null;
var categoryOfScrape = null;

function generateNewScrape(scrapeName,category) {
   const templateScrapeFile = fs.readFileSync("./templates/blankScrape.js","utf8");
   const templateScrapeFileWithScrapeName = templateScrapeFile.replace("<nameOfScrape>",scrapeName);
   const templateScrapeFileWithScrapeNameAndCategory = templateScrapeFileWithScrapeName.replace("<category>",category);

   try{
   fs.mkdirSync(`./scrapes/${category}`);
   }catch(e){}

   fs.writeFileSync(`./scrapes/${category}/${scrapeName}.js`,templateScrapeFileWithScrapeNameAndCategory,(err)=>{
       if(err){
           console.log("error writing file: ",err);
           exit();
       }
   })

   exit();

}

function checkIfScrapeNameExists(scrapeName){
    return new Promise((resolve,reject)=>{
        fs.readdir("./scrapes",(err,files)=>{
            if(err){
                reject(err);
            }else{
                let exists = false;
                files.forEach((file)=>{
                    if(file === scrapeName){
                        exists = true;
                    }
                })
                resolve(exists);
            }
        })
    }
    )   
}

function ask(question){
    return new Promise((resolve,reject)=>{
        readl.question(question,(answer)=>{
            resolve(answer);
        })
    })
}

(async ()=>{

    const name = await ask("What is the name of the scrape? ");

    if (await checkIfScrapeNameExists(name)){
        console.log("Scrape name already exists, please choose another name");
        exit();
    }

    const category = await ask("What is the category type of the scrape? ");
    // const description  = await ask("Write a description for this scrape");

    console.log("generating new scrape: ",name,category);
    generateNewScrape(name,category);

})()

