const FRIENDLYNAME = "example";
const ROOTURL="<url>";
const DESCRIPTION = "<description>";
const DATEOFCREATION="<date>"
const TYPE = "example";
const GROUPID="<groupid>";
const SCRAPERUNCONFIG = {
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

exports.handler = async (event,opt)=>{//<<do not change this line
    
    return {
       "url":url
    }

}