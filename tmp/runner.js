const runner = require("./localscrape.js");

runner.handler(null,null).then((t)=>{
    process.stdout.write(JSON.stringify(t));
    //exit
    process.exit(0);
})

