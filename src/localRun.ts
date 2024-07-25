
import { publish } from './publish.js';
import { prepare } from './prepare.js';
import { stderr, stdout } from 'node:process';

import type {PrepareContext, PublishContext, ReleaseType, VerifyConditionsContext} from 'semantic-release'
import {verifyConditions} from "./verifyConditions.js";

async function run() {
    const multiReleaseConfig = {
        configs: [
            {
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
        ]
    }

    const nextReleaseVersion = "1.0.7";
    const latestReleaseVersion = "1.0.6";

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

    verifyConditions(multiReleaseConfig, context as VerifyConditionsContext);
    await prepare(multiReleaseConfig, context as PrepareContext);
    await publish(multiReleaseConfig, context as PublishContext);
}

run();
