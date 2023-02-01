const aws = require("aws-sdk");


exports.handler = async (event,env)=>{

    return {
        url:event.url,
    }

}