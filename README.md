# @cohandv/semantic-release-update-versions

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to create major, release, fix tags into a file for other CI to pick it up

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](http://conventional-changelog.github.io)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

| Step               | Description                                                                                                                              |
| ------------------ |------------------------------------------------------------------------------------------------------------------------------------------|
| `prepare`          | [Prepares and writes the file with the atgs](https://docs.docker.com/reference/cli/docker/buildx/build)                                  |
| `verifyConditions`          | [Verifies that suffix are provided when multiple configurations are provided](https://docs.docker.com/reference/cli/docker/buildx/build) |

## Install

```bash
# For npm users
$ npm install --save-dev @cohandv/semantic-release-update-versions

# For yarn users
$ yarn add --dev @cohandv/semantic-release-update-versions
```

## Usage

The plugin can be configured in the
[**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

### Produce versions
```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        [
            "@cohandv/semantic-release-update-versions"
        ]
    ]
}
```

### Options

| Options       | Description                                                                                                                                              | Default                                    | Required |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------| :------: |
| `filePath`    | The directory where the file will be created.                                                                                                            | `.`                                        |          |
| `fileName`    | The file name.                                                                                                                                           | `semantic-release-versions.json` |          |
| `tags`        | Array of string which can be static values like `latest` or environment variables like `$NODE_ENV`                                                       | `nextRelease.version`                      |          |
| `bumpParents` | Flag to bump related tags along with the specific release version (E.G: if set to true when publishing the 1.5.0 version it will also publish 1 and 1.5) | false                                      |          |
| `suffix`      | Suffix to add on the buildign image step 5. If multiple versions are provided this is mandatory                                                          |                                            |          |

### Example

#### Build and push single component
```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        [
            "@cohandv/semantic-release-update-versions",
            {
              "config": [
                {
                  "tags": [
                    "latest",
                    "$NODE_ENV"
                  ],
                  "bumpParents": false,
                  "suffix": "sufix"
                }
              ]
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
            "@cohandv/semantic-release-update-versions",
            { 
                "config": [
                    {
                        "tags": ["latest", "$NODE_ENV", "component-1"],
                        "bumpParents": false,
                        "suffix": "component-1"
                    },
                    {
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
