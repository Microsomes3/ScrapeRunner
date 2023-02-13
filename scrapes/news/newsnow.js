const FRIENDLYNAME = "newsnow";
const ROOTURL="https://www.newsnow.co.uk/h/UK";
const DESCRIPTION = "<description>";
const DATEOFCREATION="2023-02-13"
const TYPE = "news";
const GROUPID="2";
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
    proxies:[], // if you want to use proxies, add them here
    inputs:[
        {
            "url":"https://example.com",
            "cron":"0 0 0 * * *"
        }
    ]
}

exports.handler = async (event,opt)=>{

    const toUseUrl = event.url || url;


    const newPage = await browser.newPage();

    await newPage.goto(toUseUrl, {waitUntil: 'networkidle2'});

    const title = await newPage.title();

    const allLinks = await newPage.evaluate(() => {
        const anchors =  [];
        
        document.querySelectorAll('a').forEach(link=>{
           if(link.getAttribute('href').includes("news")){
            anchors.push(link.getAttribute('href'))
           }
        })

        return anchors;
    });
    
    return {
        title:title,
        links:allLinks
    }

}