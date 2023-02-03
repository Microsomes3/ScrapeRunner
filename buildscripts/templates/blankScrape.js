const FRIENDLYNAME = "<nameOfScrape>";
const ROOTURL="<url>";
const DESCRIPTION = "<description>";
const DATEOFCREATION="<date>"
const TYPE = "<category>";
const GROUPID="<groupid>";
const SCRAPERUNCONFIG = {
    runner:'lambda', //ecs or lambda // max limit 900 seconds for lambda, use ecs for longer
    resourceControl:{
        memory:'1500',
        cpu:'1024'
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
    
    return {
        title:"test",
        content:"test",
        url:"test",
    }

}