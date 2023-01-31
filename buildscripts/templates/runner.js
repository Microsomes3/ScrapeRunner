const runner = require("./localscrape.js");

runner.handler(//<input>,null).then((t)=>{
    process.stdout.write(JSON.stringify(t));
    //exit
    process.exit(0);
})

