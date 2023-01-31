const puppeteer = require('puppeteer');
//<import2>
//<import3>
//<import4>
//<import5>


const url ='https://liveuamap.com' 
const scrapeConfig = {
  "name": "liveuamap",
  "file": "liveuamap.js",
  "scrapeCategory": "news",
  "friendlyName": "Liveuamap",
  "rootUrl": "https://liveuamap.com",
  "description": "Scrape file for Liveuamap",
  "creation": "29/01/2023",
  "type": "news",
  "groupid": 1,
  "runnerConfig": {
    "isBrowser": true,
    "isAxios": true,
    "captcha": false,
    "proxies": [
      "example.com"
    ],
    "inputs": [
      {
        "url": "https://liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://syria.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://ukraine.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://russia.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://isis.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://iraq.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://asia.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://usa.liveuamap.com",
        "cron": "0 0 0 * * *"
      },
      {
        "url": "https://dc.liveuamap.com",
        "cron": "0 0 0 * * *"
      }
    ]
  },
  "filetxt": "const FRIENDLYNAME = \"Liveuamap\";\nconst ROOTURL=\"https://liveuamap.com\";\nconst DESCRIPTION = \"Scrape file for Liveuamap\";\nconst DATEOFCREATION=\"29/01/2023\"\nconst TYPE = \"news\";\nconst GROUPID=1;\nconst SCRAPERUNCONFIG = {\n    isBrowser:true,\n    isAxios:true,\n    captcha:false, // if you want to use captcha, set this to true\n    proxies:[\"example.com\"], // if you want to use proxies, add them here\n    inputs:[\n        {\n            \"url\":\"https://liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://syria.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://ukraine.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://russia.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://isis.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://iraq.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://asia.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://usa.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        },\n        {\n            \"url\":\"https://dc.liveuamap.com\",\n            \"cron\":\"0 0 0 * * *\"\n        }\n    ]\n}\n\nexports.handler = async (event,opt)=>{//<<do not change this line\n    \n\n    const newPage = await browser.newPage();\n\n    const urltoUse = event.url || url;\n\n\n    await newPage.goto(urltoUse,{\n        waitUntil: 'networkidle0',\n    });\n\n    const title = await newPage.title();\n\n\n    await browser.close();\n\n    return {\n        url:urltoUse,\n        title,\n    }\n\n}"
}

exports.handler = async (event,opt)=>{//<<do not change this line

    const browser = await puppeteer.launch({
    headless:true
});


    
    

    const newPage = await browser.newPage();

    const urltoUse = event.url || url;


    await newPage.goto(urltoUse,{
        waitUntil: 'networkidle0',
    });

    const title = await newPage.title();


    await browser.close();

    return {
        url:urltoUse,
        title,
    }

    
}