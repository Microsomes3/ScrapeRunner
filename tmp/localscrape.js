const puppeteer = require('puppeteer');
//<import2>
//<import3>
//<import4>
//<import5>


const url = 'https://bbc.co.uk'

exports.handler = async (event,opt)=>{//<<do not change this line

    const browser = await puppeteer.launch({
    headless:true
});


    
    

    const newPage = await browser.newPage();

    await newPage.goto(url);

    const title = await newPage.title();

    await browser.close();

    return {
        url:url,
        title,
    }

    
}