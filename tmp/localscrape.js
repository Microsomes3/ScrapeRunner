//<import1>
//<import2>
//<import3>
//<import4>
//<import5>


//<const>

exports.handler = async (event,opt)=>{//<<do not change this line

    const browser = await puppeteer.launch({
    headless:false
});


    
    

    const newPage = await browser.newPage();

    await newPage.goto(url);

    const title = await newPage.title();

    return {
        url:url,
        title,
    }

    
}