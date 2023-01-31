//responsible for uploading the scraped definitions to the database

var fs = require('fs');

var scrapeDefs = JSON.parse(fs.readFileSync('./dist/scrapes.json', "utf8"));

var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
    region: 'eu-west-1'
});

const docuemntClient = new AWS.DynamoDB.DocumentClient({
    tableName: 'scrapedefs',
    region: 'eu-west-1'
});


const toPut = [];

scrapeDefs.forEach((scrapeDef) => {
    const org = "microsomes";
    var params = {
        TableName: 'scrapedefs',
        Item: {
            "scrapeName": scrapeDef.name+"_"+org,
            "name":scrapeDef.name,
            "type":scrapeDef.type,
            "organisation": org,
            "def": scrapeDef,
        }
    };

    toPut.push(params);
});

(async ()=>{
    for(let i = 0; i < toPut.length; i++){
        await docuemntClient.put(toPut[i]).promise();
    }
})();


