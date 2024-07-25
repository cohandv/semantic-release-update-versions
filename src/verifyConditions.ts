import type { VerifyConditionsContext } from 'semantic-release'

import { AWS } from './aws.js'
import { getError } from './error.js'
import type { PluginConfig } from './types.js'

export function verifyConditions(pluginConfig: PluginConfig | Array<PluginConfig>, context: VerifyConditionsContext): void {
    const errors = [];
    const awsConfig = AWS.loadConfig(context);

    if (!awsConfig.region) {
        errors.push(getError('ENOREGION'));
    }

    if(Array.isArray(pluginConfig)) {
        pluginConfig.map(async (config) => {
            if (!config.imageName) {
                errors.push(getError('ENOIMAGENAME'));
            }
        });
    } else {
        if (!pluginConfig.imageName) {
            errors.push(getError('ENOIMAGENAME'));
        }
    }

    if (errors.length > 0) {
        throw new AggregateError(errors);
    }
}
