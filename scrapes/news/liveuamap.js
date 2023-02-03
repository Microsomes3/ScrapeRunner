const FRIENDLYNAME = "Liveuamap";
const ROOTURL="https://liveuamap.com";
const DESCRIPTION = "Scrape file for Liveuamap";
const DATEOFCREATION="29/01/2023"
const TYPE = "news";
const GROUPID=2;
const SCRAPERUNCONFIG = {
    runner:'lambda', //ecs or lambda
    resourceControl:{
        memory:'1500',
        cpu:'1024'
    },
    isBrowser:true,
    isAxios:true,
    captcha:false, // if you want to use captcha, set this to true
    proxies:["example.com"], // if you want to use proxies, add them here
    inputs:[
        {
            "url":"https://liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://syria.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://ukraine.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://russia.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://isis.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://iraq.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://asia.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://usa.liveuamap.com",
            "cron":"0 0 0 * * *"
        },
        {
            "url":"https://dc.liveuamap.com",
            "cron":"0 0 0 * * *"
        }
    ]
}

exports.handler = async (event,opt)=>{//<<do not change this line
    

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