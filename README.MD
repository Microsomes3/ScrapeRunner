#Welcome to WebScrape Runner

A tool to automatically genetate AWS lambda folders for each scrape

Use the npm run new cli to generate a scrape and run it with or without Puppteer which gets auto injected in to your scrapes

```bash
npm run new #creates a new scrape
npm run build #generates a dist folder, with lambda functions which are ready to be deployed to aws
npm run deploy #will create or update lambdas with the built functions to aws
node buildscripts/local.js <scrapename> <input id> #will locally execute the scrape for local testing
node buildscripts/run.js <scrapename> <input id> #will invoke the lambda function where the specified scrape is
```

Mode details coming soon