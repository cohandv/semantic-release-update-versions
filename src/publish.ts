import type { PublishContext } from 'semantic-release'

import { AWS } from './aws.js'
import type { AWSConfigType } from './aws.types.js'
import { Docker } from './docker.js'
import { getError } from './error.js'
import type { PluginConfig, MultiReleaseConfig } from './types.js'

export async function publish(pluginConfig: PluginConfig | MultiReleaseConfig, context: PublishContext): Promise<void> {
    const awsConfig = AWS.loadConfig(context) as AWSConfigType;
    const aws = new AWS(awsConfig.region, awsConfig.accessKeyId, awsConfig.secretAccessKey);

    const awsLoginValue = await aws.login();

    context.logger.log(`Successfully logged in to ${awsLoginValue.registry}`);

    const docker = new Docker()
    const dockerLogin = await docker.login(awsLoginValue.username, awsLoginValue.password, awsLoginValue.registry)

    if (!dockerLogin) {
        throw new AggregateError([getError('ENOAUTHENTICATION')])
    }

    if((pluginConfig as MultiReleaseConfig).configs) {
        Promise.all((pluginConfig as MultiReleaseConfig).configs.map(async (config) => {
            await publishSingle(config, context, docker, awsLoginValue.registry);
        }));
    } else {
        await publishSingle(pluginConfig as PluginConfig, context, docker, awsLoginValue.registry);
    }
}

async function publishSingle(pluginConfig: PluginConfig, context: PublishContext, docker: Docker, registry: string) {
    const dockerConfig = Docker.loadConfig(pluginConfig, context);

    context.logger.log(
        `Pushing ${pluginConfig.imageName} with tags [${dockerConfig.imageTags.join(', ')}] to ${registry}`,
    )

    const dockerPush = await docker.push(dockerConfig.imageName, dockerConfig.imageTags, registry)

    if (!dockerPush) {
        throw new AggregateError([getError('EDEPLOY')])
    }

    context.logger.log(
        `Successfully pushed ${pluginConfig.imageName} with tags [${dockerConfig.imageTags.join(', ')}] to ${registry}`,
    )
}
