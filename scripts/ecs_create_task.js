const aws = require("aws-sdk");

const testScrapeDocker = "public.ecr.aws/m8l7i2c5/localscrape:latest";
const taskName = "localscrape_generated";


//create an ecs task definition
const ecs = new aws.ECS({
    region: "eu-west-1"
});

const taskDefinition = {
    "containerDefinitions": [
        {
            "name": "local",
            "image": testScrapeDocker,
            "cpu": 0,
            "portMappings": [
                {
                    "name": "http",
                    "containerPort": 80,
                    "hostPort": 80,
                    "protocol": "tcp",
                    "appProtocol": "http"
                },
                {
                    "name": "local-443-tcp",
                    "containerPort": 443,
                    "hostPort": 443,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [],
            "environmentFiles": [],
            "mountPoints": [],
            "volumesFrom": [],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-create-group": "true",
                    "awslogs-group": "/ecs/run_localscrape",
                    "awslogs-region": "eu-west-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ],
    "family": taskName,
    "taskRoleArn": "arn:aws:iam::574134043875:role/ecsTaskExecutionRole",
    "executionRoleArn": "arn:aws:iam::574134043875:role/ecsTaskExecutionRole",
    "networkMode": "awsvpc",
    "volumes": [],
    "placementConstraints": [],
 
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "2048",
    "memory": "5120",
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
    "tags": [
        {
            "key": "ecs:taskDefinition:createdFrom",
            "value": "ecs-console-v2"
        }
    ]
}

//deploy the task definition
const deployTask = async () => {
    const task = await ecs.registerTaskDefinition(taskDefinition).promise();
    console.log(task)
}

deployTask().then((d) => {
    console.log("task deployed")
})



const runTask = {
    "cluster": "Scrapper",
    "taskDefinition": "scrape_local_generated",
    "launchType": "FARGATE",
    "networkConfiguration": {
        "awsvpcConfiguration": {
            "subnets": [
                "subnet-1234567890abcdef0",
                "subnet-1234567890abcdef1"
            ],
            "securityGroups": [
                "sg-1234567890abcdef0"
            ],
            "assignPublicIp": "ENABLED"
        }
    },

}

//launch the task

