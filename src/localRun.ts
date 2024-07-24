
import { AWS } from './aws.js';

import { publish } from './publish.js';
// import { prepare } from './prepare.js';
import { Docker } from './docker.js'
import { getError } from './error.js'
import { stderr, stdout } from 'process';

import type { ReleaseType } from 'semantic-release'

async function run() {
    const awsConfig = {
        region: 'us-east-1',
    }

    const aws = new AWS(awsConfig.region, null, null);
    const awsLoginValue = await aws.login()

    console.log(`Successfully logged in to ${awsLoginValue.registry}`);

    const docker = new Docker()
    const dockerLogin = await docker.login(awsLoginValue.username, awsLoginValue.password, awsLoginValue.registry)

    if (!dockerLogin) {
        throw new AggregateError([getError('ENOAUTHENTICATION')])
    }

    if(dockerLogin) {
        console.log('Docker login successful');
    }

    const pluginConfig = {
        "buildImage": "docker build . -f ../Dockerfile -t my-ecr-image",
        "imageName": "my-ecr-image",
        "tags": ["latest", "1.0.0"],
        "bumpParents": false
    }

    const context = {
        nextRelease: {
            type: "major" as ReleaseType,
            channel: "latest",
            version: "1.0.0",
            gitHead: "1234567890",
            gitTag: "v0.0.0",
            name: "v0.0.0"
        },
        env: {},
        commits: [],
        releases: [],
        lastRelease: {
            version: "0.0.0",
            gitHead: "1234567890",
            gitTag: "v0.0.0",
            channel: "latest",
            name: "v0.0.0",
            channels: []
        },
        envCi: {
            isCi: false,
            commit: "1234567890",
            branch:"main" ,
        },
        branch: { 
            name:"main" 
        },
        options: {},
        branches: [],
        logger: console,
        stdout: stdout,
        stderr: stderr

    }

    const dockerConfig = Docker.loadConfig(pluginConfig, context)

    // await prepare(pluginConfig, context);
    context.logger.log(
        `Pushing ${pluginConfig.imageName} with tags [${dockerConfig.imageTags.join(', ')}] to ${awsLoginValue.registry}`,
    )

    const dockerPush = await docker.push(dockerConfig.imageName, dockerConfig.imageTags, awsLoginValue.registry)

    if (!dockerPush) {
        throw new AggregateError([getError('EDEPLOY')])
    }

    context.logger.log(
        `Successfully pushed ${pluginConfig.imageName} with tags [${dockerConfig.imageTags.join(', ')}] to ${awsLoginValue.registry}`,
    )

    // publish(pluginConfig, context);
}

run();
