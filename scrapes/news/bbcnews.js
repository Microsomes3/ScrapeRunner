const FRIENDLYNAME = "BBC News";
const ROOTURL = "https://www.bbc.co.uk/news";
const DESCRIPTION = "Scrape file for BBC News";
const DATEOFCREATION = "29/01/2023"
const TYPE = "news";
const GROUPID = 1;
const SCRAPERUNCONFIG = {
    isBrowser: true,
    isAxios: true,
    captcha: true, // if you want to use captcha, set this to true
    proxies: ["example.com"], // if you want to use proxies, add them here
    inputs: [
        {
            "url": "https://www.bbc.co.uk/news",
            "cron": "0 0 0 * * *"
        }
    ]
}


exports.handler = async (event,opt)=>{//<<do not change this line
    ///--

    return {
        "url": url
    }




}
///--