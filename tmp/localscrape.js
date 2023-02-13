const puppeteer = require('puppeteer');
const axios = require('axios');
//<import3>
//<import4>
//<import5>


const url ='https://www.newsnow.co.uk/h/UK' 
const scrapeConfig = {
  "name": "newsnow",
  "file": "newsnow.js",
  "scrapeCategory": "news",
  "friendlyName": "newsnow",
  "rootUrl": "https://www.newsnow.co.uk/h/UK",
  "description": "<description>",
  "creation": "2023-02-13",
  "type": "news",
  "groupid": "2",
  "runnerConfig": {
    "runner": "lambda",
    "resourceControl": {
      "memory": "1500",
      "cpu": "1024",
      "timeout": 900
    },
    "isBrowser": true,
    "isAxios": true,
    "captcha": false,
    "proxies": [],
    "inputs": [
      {
        "url": "https://example.com",
        "cron": "0 0 0 * * *"
      }
    ]
  },
  "filetxt": "const FRIENDLYNAME = \"newsnow\";\nconst ROOTURL=\"https://www.newsnow.co.uk/h/UK\";\nconst DESCRIPTION = \"<description>\";\nconst DATEOFCREATION=\"2023-02-13\"\nconst TYPE = \"news\";\nconst GROUPID=\"2\";\nconst SCRAPERUNCONFIG = {\n    runner:'lambda', //ecs or lambda // max limit 900 seconds for lambda, use ecs for longer\n    resourceControl:{\n        memory:'1500',\n        cpu:'1024', //ecs only\n        timeout:900 // max limit 900 seconds for lambda, use ecs for longer\n    },\n    isBrowser:true,\n    isAxios:true,\n    captcha:false, // if you want to use captcha, set this to true\n    proxies:[], // if you want to use proxies, add them here\n    inputs:[\n        {\n            \"url\":\"https://example.com\",\n            \"cron\":\"0 0 0 * * *\"\n        }\n    ]\n}\n\nexports.handler = async (event,opt)=>{\n    \n    return {\n        title:\"test\",\n        content:\"test\",\n        url:\"test\",\n    }\n\n}"
}

exports.handler = async (event,opt)=>{//<<do not change this line

    const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args:['--no-sandbox'],
    headless:true
});


    
    

    const newPage = await browser.newPage();

    const urltoUse = event.url || url;


    await newPage.goto(urltoUse,{
        waitUntil: 'networkidle0',
    });

    const title = await newPage.title();


    await browser.close();

    // await axios.post("https://9bef-77-102-234-41.eu.ngrok.io/injest",{
    //     "scrapeId":3,
    //     url:urltoUse,
    //     title
    // });

    return {
        url:urltoUse,
        title
    }

    
}