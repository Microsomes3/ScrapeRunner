# Welcome to WebScrape Runner

A tool to automatically genetate AWS lambda folders for each scrape

Use the npm run new cli to generate a scrape and run it with or without Puppteer which gets auto injected in to your scrapes

```bash
npm run new #creates a new scrape
npm run build #generates a dist folder, with lambda functions which are ready to be deployed to aws
npm run deploy #will create or update lambdas with the built functions to aws
node buildscripts/local.js <scrapename> <input id> #will locally execute the scrape for local testing
node buildscripts/run.js <scrapename> <input id> #will invoke the lambda function where the specified scrape is
```
    
    //todo  task list for future

    [x]: # Generate Docker file for each scrape, so user can choose to run on lambda or ECS
    []: # Generate Terraform file, and Ansible to run scapes in DO,EC2 or other VPS providers witout issues, to avoid vendor lock in
    []: # Generate dynamic squid proxies before scrapes run to always run on a different IP
    []: # Create private residential proxies using Raspberry pies, softare + hardware 
    

Mode details coming soon