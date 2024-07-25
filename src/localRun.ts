
import { publish } from './publish.js';
import { prepare } from './prepare.js';
import { stderr, stdout } from 'process';

import type { ReleaseType } from 'semantic-release'

async function run() {
    const pluginConfig = {
        "buildImage": "docker build . -f ../Dockerfile -t my-ecr-image",
        "imageName": "my-ecr-image",
        "tags": ["latest"],
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
        env: {
            AWS_DEFAULT_REGION: "us-east-1",
        },
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
    await prepare(pluginConfig, context);
    await publish(pluginConfig, context);
}

run();
