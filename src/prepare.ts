import type { PrepareContext } from 'semantic-release'

import { Docker } from './docker.js'
import { getError } from './error.js'
import type { PluginConfig } from './types.js'

export async function prepare(pluginConfig: PluginConfig | Array<PluginConfig>, context: PrepareContext): Promise<void> {
    if(Array.isArray(pluginConfig)) {
        Promise.all(pluginConfig.map(async (config) => {
            await prepareSingle(config, context);
        }));
    } else {
        await prepareSingle(pluginConfig, context)
    }
}

async function prepareSingle(pluginConfig: PluginConfig, context: PrepareContext) {
    if (!pluginConfig.buildImage) {
        context.logger.log('No "buildImage" command provided, skipping prepare step')

        return
    }

    context.logger.log('Found "buildImage" command, building docker image')

    const docker = new Docker()
    const dockerBuild = await docker.build(pluginConfig.buildImage)

    if (!dockerBuild) {
        throw new AggregateError([getError('EBUILD')])
    }

    context.logger.log('Successfully built docker image')
}
