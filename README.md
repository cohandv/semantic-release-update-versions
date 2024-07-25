# @cjpablo92/semantic-release-ecr

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish a docker image to the AWS Elastic
Container Registry using AWS IAM roles, forked from [**RimacTechnology/semantic-release-ecr**](https://github.com/RimacTechnology/semantic-release-ecr/tree/master), also adding the ability to build and push multiple components at the same time.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](http://conventional-changelog.github.io)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

| Step               | Description                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify the presence of the `AWS_DEFAULT_REGION` environment variables and docker `imageName` plugin option |
| `publish`          | [Publish the docker image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html) to the aws ecr.                               |
| `prepare`          | [Builds the docker image](https://docs.docker.com/reference/cli/docker/buildx/build)                                                                        |

## Install

```bash
# For npm users
$ npm install --save-dev @cjpablo92/semantic-release-ecr

# For yarn users
$ yarn add --dev @cjpablo92/semantic-release-ecr
```

## Usage

The plugin can be configured in the
[**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

### Push single component
```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        [
            "@cjpablo92/semantic-release-ecr",
            {
                "imageName": "my-ecr-image"
            }
        ]
    ]
}
```

#### Push multiple components
```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        [
            "@cjpablo92/semantic-release-ecr",
            {
                "config": [
                    {
                        "imageName": "my-ecr-image-component-1"
                    },
                    {
                        "imageName": "my-ecr-image-component-2"
                    }
                ]
            }
        ]
    ]
}
```

## Prerequisites

To use this plugin you need to set up an ECR container registry if you don't already have on. Here is a
[AWS ECR Getting started](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_GetStarted.html) guide from AWS on how to set
up a new registry.

**IMPORTANT!** This plugin expects the docker image to be built already, or you can build it with "dockerImage" configuration
option

## Configuration

### Environment variables

| Variable                | Description       | Required |
| ----------------------- | ----------------- | :------: |
| `AWS_ACCESS_KEY_ID`     | AWS access key id |          |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key    |          |
| `AWS_DEFAULT_REGION`    | AWS region        |    ✓     |

**Note**: If `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are not present it will use the default credentials and their [fallbacks](https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/creds-assign.html) (like IAM roles).

### Options

| Options      | Description                                                                                                                                                                                                                                                                                                 | Default               | Required |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | :------: |
| `buildImage` | Docker command which will build an image                                                                                                                                                                                                                                                                    |                       |          |
| `imageName`  | The name of the image to push to the ECR. The name should be the same as your ECR repository name (example: `my-ecr-image`). Remember that you don't need to add your registry URL in front of the image name, the plugin will fetch this URL from AWS and add it for you. Don't add tag in the `imageName` |                       |    ✓     |
| `tags`       | Array of string which can be static values like `latest` or environment variables like `$NODE_ENV`                                                                                                                                                                                                          | `nextRelease.version` |          |
| `bumpParents`| Flag to bump related tags along with the specific release version (E.G: if set to true when publishing the 1.5.0 version it will also publish 1 and 1.5)                                                                                                                                                    | false                 |          |
| `suffix`     | Suffix to add on the buildign image step 5                                                                                                                                                    |                       |          |

### Example

#### Build and push single component
```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        [
            "@cjpablo92/semantic-release-ecr",
            {
                "buildImage": "docker build . -t my-ecr-image",
                "imageName": "my-ecr-image",
                "tags": ["latest", "$NODE_ENV"],
                "bumpParents": false,
                "suffix": "sufix"
            }
        ]
    ]
}
```

#### Build and push multiple components
```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        [
            "@cjpablo92/semantic-release-ecr",
            { 
                "config": [
                    {
                        "buildImage": "docker build . -t my-ecr-image-component-1",
                        "imageName": "my-ecr-image",
                        "tags": ["latest", "$NODE_ENV", "component-1"],
                        "bumpParents": false,
                        "suffix": "component-1"
                    },
                    {
                        "buildImage": "docker build . -t my-ecr-image-component-2",
                        "imageName": "my-ecr-image",
                        "tags": ["latest", "$NODE_ENV", "component-2"],
                        "bumpParents": false,
                        "suffix": "component-2"
                    }
                ]
            }
        ]
    ]
}
```

### Run locally

```bash
npm install -g tsx
npx tsx src/localRun.ts
```
