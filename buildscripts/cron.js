//sets up cronjobs to run the scrapes based on their cron configs

const AWS = require("aws-sdk");

const scrapes = require("../dist/scrapes.json");


//setup eventbridge cron jobs

const eventBridge = new AWS.EventBridge({
    region: "eu-west-1"
});

const eventBusName = "microsomes";

const eventBusParams = {
    Name: eventBusName
};

const eventBusExists = async () => {
    try {
        await eventBridge.describeEventBus(eventBusParams).promise();
        return true;
    } catch (err) {
        return false;
    }
}

const createEventBus = async () => {
    await eventBridge.createEventBus(eventBusParams).promise();
}




