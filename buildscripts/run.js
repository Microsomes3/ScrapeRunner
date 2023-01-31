//file will invoke the lambda function specified
const fs = require("fs")
const scrapeName = process.argv[2];
const scrapeInput = process.argv[3];

const allScrapes = JSON.parse(fs.readFileSync("dist/scrapes.json"));

const scrape = allScrapes.find((s)=>{
    return s.name === scrapeName;
})

if(scrape == undefined){
    console.log("scrape not found")
    return;
}


//invoke the lambda function

const aws = require("aws-sdk");

const lambda = new aws.Lambda({
    region: 'eu-west-1'
});

const params = {
    FunctionName: scrape.name+"_scrape_generated",
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
        url: "https://google.com"
    })
};

lambda.invoke(params, function(err, data) {
    if(err){
        console.log("err",err)
    }else{
        console.log(data.Payload)
    }
});