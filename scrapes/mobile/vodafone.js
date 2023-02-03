const FRIENDLYNAME = "vodafone";
const ROOTURL="https://www.vodafone.co.uk/";
const DESCRIPTION = "scrapes the vodafone website";
const DATEOFCREATION="03/02/2021"
const TYPE = "mobile";
const GROUPID="2";
const SCRAPERUNCONFIG = {
    runner:'lambda', //ecs or lambda // max limit 900 seconds for lambda, use ecs for longer
    resourceControl:{
        memory:'1023',
        cpu:'1024', //ecs only
        timeout:60 // max limit 900 seconds for lambda, use ecs for longer
    },
    isBrowser:true,
    isAxios:true,
    captcha:false, // if you want to use captcha, set this to true
    proxies:[], // if you want to use proxies, add them here
    inputs:[
        {
            "url":"https://www.vodafone.co.uk",
            "cron":"0 0 0 * * *"
        }
    ]
}

exports.handler = async (event,opt)=>{

    const newPage = await browser.newPage();

    const urltoUse = event.url || url;

    await newPage.goto(urltoUse,{
        waitUntil: 'networkidle0',
    });

    const title = await newPage.title();

    await browser.close();
    
    return {
        title:title
    }

}