const runner = require("./localscrape.js");

runner.handler( {
  "url": "https://example.com",
  "cron": "0 0 0 * * *"
},null).then((t)=>{
    process.stdout.write(JSON.stringify(t));
    //exit
    process.exit(0);
})

