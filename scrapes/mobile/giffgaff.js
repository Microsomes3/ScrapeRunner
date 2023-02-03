const FRIENDLYNAME = "Giffgaff";
const ROOTURL="https://www.giffgaff.com/";
const DESCRIPTION = "Scrape file for Giffgaff";
const DATEOFCREATION="29/01/2023"
const TYPE = "mobile";
const GROUPID=2;
const SCRAPERUNCONFIG = {
    runner:'lambda', //ecs or lambda // max limit 900 seconds for lambda, use ecs for longer
    resourceControl:{
        memory:'1500',
        cpu:'1024', //ecs only
        timeout:900 // max limit 900 seconds for lambda, use ecs for longer
    },
    isBrowser:true,
    isAxios:true,
    captcha:false, // if you want to use captcha, set this to true
    proxies:["example.com"], // if you want to use proxies, add them here
    inputs:[
        {
            "url":"https://www.giffgaff.com/",
            "cron":"0 0 0 * * *"
        }
    ]
}

exports.handler = async (event,opt)=>{//<<do not change this line
    return {
        title:"test",
        content:"test",
        url:ROOTURL,
    }
}