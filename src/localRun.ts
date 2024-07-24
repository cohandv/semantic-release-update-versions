
import { AWS } from './aws.js';

import { publish } from './publish.js';

async function run() {
    const awsConfig = {
        region: 'us-east-1',
    }

    const aws = new AWS(awsConfig.region, null, null);
    console.log(aws.awsEcr);
    const awsLoginValue = await aws.login()

    console.log(`Successfully logged in to ${awsLoginValue.registry}`)

    const pluginConfig = {
        "buildImage": "docker build . -f ../Dockerfile",
        "imageName": "my-ecr-image",
        "tags": ["latest"],
        "bumpParents": false
    }

    // publish(pluginConfig, );
}

run();
