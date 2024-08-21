import { promises as fs } from 'fs';
import type {PrepareContext} from 'semantic-release'

import type { PluginConfig, MultiReleaseConfig } from './types.js'

export async function prepare(pluginConfig: PluginConfig | MultiReleaseConfig, context: PrepareContext): Promise<void> {
    if((pluginConfig as MultiReleaseConfig).configs) {
        const config = pluginConfig as MultiReleaseConfig;
        if (config.configs.length > 1) {
            Promise.all(config.configs.map(async (config) => {
                await prepareSingle(config, context, true);
            }));
        } else {
            await prepareSingle(pluginConfig as PluginConfig, context, false)
        }
    }
}

async function prepareSingle(pluginConfig: PluginConfig, context: PrepareContext, isMulti) {
    context.logger.log('Preparing version numbers')

    const tags: string[] = []
    const nextReleaseVersion = pluginConfig.suffix ? `${context.nextRelease.version}-${pluginConfig.suffix}` :
        context.nextRelease.version;
    const rawTags: string[] = [nextReleaseVersion]

    // Add the next release version but also add parents to bump to latest build
    if (pluginConfig.bumpParents) {
        const [major, minor] = nextReleaseVersion.split('.')
        if(pluginConfig.suffix) {
            tags.push(`${major}.${minor}-${pluginConfig.suffix}`, `${major}-${pluginConfig.suffix}`)
        } else {
            tags.push(`${major}.${minor}`, `${major}`)
        }
    }

    if (pluginConfig.tags) {
        rawTags.push(...pluginConfig.tags)
    }

    for (const rawTag of rawTags) {
        const tag = rawTag.startsWith('$') ? context.env[rawTag.slice(1)] : rawTag

        if (tag) {
            tags.push(rawTag)
        }
    }

    context.logger.log(`Tags ${tags}`)
    const fileDst= `${pluginConfig.filePath? pluginConfig.filePath: "." }/${pluginConfig.fileName? pluginConfig.fileName: "semantic-release-versions" }${isMulti?'-'+pluginConfig.suffix:''}.json`
    context.logger.log(`fileDst ${fileDst}`)
    await fs.writeFile( fileDst, JSON.stringify(tags), 'utf8');

    context.logger.log('Successfully prepared the config file')
}
