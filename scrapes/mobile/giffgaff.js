const FRIENDLYNAME = "Giffgaff";
const ROOTURL="https://www.giffgaff.com/";
const DESCRIPTION = "Scrape file for Giffgaff";
const DATEOFCREATION="29/01/2023"
const TYPE = "mobile";
const GROUPID=2;
const SCRAPERUNCONFIG = {
    isBrowser:true,
    isAxios:true,
    captcha:false, // if you want to use captcha, set this to true
    proxies:["example.com"], // if you want to use proxies, add them here
    cron:"0 0 0 * * *", // if you want to use cron, add it here
    inputs:[
        {
            "url":"https://www.giffgaff.com/",
        }
    ]
}

exports.handler = async (event,opt)=>{
    return {
        title:"test",
        content:"test",
        url:ROOTURL,
    }
}