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
}

exports.handler = async (event,opt)=>{
    
    return {
        title:"test",
        content:"test",
        url:"test",
    }

}