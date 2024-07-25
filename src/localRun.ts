
import { publish } from './publish.js';
import { prepare } from './prepare.js';
import { stderr, stdout } from 'process';

import type { ReleaseType } from 'semantic-release'

async function run() {
    // const pluginConfig = {
    //     "buildImage": "docker build . -f ../Dockerfile -t semantic-release-ecr",
    //     "imageName": "semantic-release-ecr",
    //     "tags": ["latest"],
    //     "bumpParents": true
    // }

    const pluginConfig = [{
            "buildImage": "docker build . -f ../Dockerfile -t semantic-release-ecr",
            "imageName": "semantic-release-ecr",
            "tags": ["latest-consumer","consumer"],
            "suffix": "consumer",
            "bumpParents": true
        },
        {
            "buildImage": "docker build . -f ../Dockerfile -t semantic-release-ecr",
            "imageName": "semantic-release-ecr",
            "tags": ["latest-producer","producer"],
            "suffix": "producer",
            "bumpParents": true
        }
    ];
    let nextReleaseVersion = "1.0.5";
    let latestReleaseVersion = "1.0.4";

    const context = {
        nextRelease: {
            type: "major" as ReleaseType,
            channel: "latest",
            version: nextReleaseVersion,
            gitHead: "1234567890",
            gitTag: `v${nextReleaseVersion}`,
            name: `v${nextReleaseVersion}`
        },
        env: {
            AWS_DEFAULT_REGION: "us-east-1",
        },
        commits: [],
        releases: [],
        lastRelease: {
            version: latestReleaseVersion,
            gitHead: "1234567890",
            gitTag: `v${latestReleaseVersion}`,
            channel: "latest",
            name: `v${latestReleaseVersion}`,
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
