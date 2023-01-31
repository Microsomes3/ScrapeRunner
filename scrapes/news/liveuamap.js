const FRIENDLYNAME = "Liveuamap";
const ROOTURL="https://liveuamap.com";
const DESCRIPTION = "Scrape file for Liveuamap";
const DATEOFCREATION="29/01/2023"
const TYPE = "news";
const GROUPID=1;
const SCRAPERUNCONFIG = {
    isBrowser:true,
    isAxios:true,
    captcha:false, // if you want to use captcha, set this to true
    proxies:["example.com"], // if you want to use proxies, add them here
    cron:"0 0 0 * * *", // if you want to use cron, add it here
    inputs:[
        {
            "url":"https://liveuamap.com"
        },
        {
            "url":"https://syria.liveuamap.com"
        },
        {
            "url":"https://ukraine.liveuamap.com"
        },
        {
            "url":"https://russia.liveuamap.com"
        },
        {
            "url":"https://isis.liveuamap.com"
        },
        {
            "url":"https://iraq.liveuamap.com"
        },
        {
            "url":"https://asia.liveuamap.com"
        },
        {
            "url":"https://usa.liveuamap.com"
        },
        {
            "url":"https://dc.liveuamap.com"
        }
    ]
}

exports.handler = async (event,opt)=>{
    
    return {
        title:"test",
        content:"test",
        url:"test",
    }

}