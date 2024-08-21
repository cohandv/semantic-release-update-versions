import type { VerifyConditionsContext } from 'semantic-release'

import { AWS } from './aws.js'
import { getError } from './error.js'
import type { PluginConfig, MultiReleaseConfig } from './types.js'

export function verifyConditions(pluginConfig: PluginConfig | MultiReleaseConfig, context: VerifyConditionsContext): void {
    const errors = [];

    if((pluginConfig as MultiReleaseConfig).configs) {
        const config = pluginConfig as MultiReleaseConfig;
        if (config.configs.length > 1) {
            config.configs.map(async (config) => {
                if (!config.suffix) {
                    errors.push(new Error('Configuration is multi and no suffix is provided'));
                }
            });
        }
    }

    if (errors.length > 0) {
        throw new AggregateError(errors);
    }
}
