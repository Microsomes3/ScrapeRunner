//should take dist folders lambda and create lambdas in aws and set up event triggers
const aws= require('aws-sdk');
const fs= require("fs");
const {exec} = require("child_process");


async function checkLambdaFunctionExists(name){
    return new Promise((resolve,reject)=>{
        const lambda = new aws.Lambda({
            region: 'eu-west-1'
        });
        lambda.getFunction({
            FunctionName: name
        },(err,data)=>{
            if(err){
                resolve(false)
            }else{
                resolve(true)
            }
        })
    })
}

async function createLambda(name,scrape){
    return new Promise((resolve,reject)=>{
        const lambda = new aws.Lambda({
            region: 'eu-west-1'
        });

        const params = {
            Code: {
                S3Bucket: 'scrapes69',
                S3Key: scrape.name+'.zip'
            },
            FunctionName: name,
            Handler: 'index.handler',
            Role: 'arn:aws:iam::574134043875:role/LamdaDynamo',
            Runtime: 'nodejs14.x',
            Timeout: 900,
            MemorySize: 1500,
            Publish: true
        };
        
        lambda.createFunction(params, function(err, data) {
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        });
    
    })
}

function updateLambda(name,scrape){
    return new Promise((resolve,reject)=>{
        const lambda = new aws.Lambda({
            region: 'eu-west-1'
        });

        const params = {
                S3Bucket: 'scrapes69',
                S3Key: scrape.name+'.zip',
            FunctionName: name,
            Publish: true
        };
        
        lambda.updateFunctionCode(params, function(err, data) {
            console.log(data)
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        });
    
    })
}

const allScrapes = JSON.parse(fs.readFileSync("./dist/scrapes.json").toString());

function runZip(scrape){
    return new Promise((resolve,reject)=>{
        exec(`cd dist/${scrape.name} && npm run zip`,(err,stdout,stderr)=>{
            if(err){
                reject(err)
            }else{
                resolve(stdout)
            }
        })
    })
}

function uploadFunctionS3(scrape){
    return new Promise((resolve,reject)=>{
        exec(`cd dist/${scrape.name} && npm run upload`,(err,stdout,stderr)=>{
            if(err){
                reject(err)
            }else{
                resolve(stdout)
            }
        })
    }   )
}

(async()=>{
    for(var i=0;i<allScrapes.length;i++){
        const scrape = allScrapes[i];
        const functionName = scrape.name+"_scrape_generated";
        const exists =  await checkLambdaFunctionExists(functionName);
        await runZip(scrape);
        await uploadFunctionS3(scrape);
        console.log(functionName,exists)
    }
})()


// allScrapes.forEach(async scrape=>{

//     const functionName = scrape.name+"_scrape_generated";
    
      
//    const exists =  await checkLambdaFunctionExists(functionName);

//    if(exists){
//     //update lambda
//     console.log("lambda already exists")

//     await updateLambda(functionName,scrape);

//    }else{
//     //create lambda
//     const d =await createLambda(functionName,scrape);
//    }


    

// })


