require("dotenv").config();
//connects to DO,AWS,LINDOE to create a proxy


function startDoProxy(){
    return new Promise((resolve,reject)=> {

        //spin up a cheap droplet and install proxy
        const DigitalOcean = require("do-wrapper").default;
        const doClient = new DigitalOcean(process.env.DO_TOKEN, 1000);
       
    });
}