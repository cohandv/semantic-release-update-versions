import type { Config } from 'semantic-release'

export interface PluginConfig extends Config {

    /**
     * The file path to write the file, it will default to working dir
     *
     * @default ""
     */
    filePath?: string
    /**
     * The file name to write the file, it will default to semantic-release-versions.json
     *
     * @default ""
     */
    fileName?: string
    /**
     * Additional values which will be used to tag image
     *
     * @default ""
     */
    tags?: string[]
    /**
     * Flag to bump parents along with the next release version
     *
     * @default false
     */
    bumpParents?: boolean
    /**
     * Suffix to add to the tags
     *
     * @default ""
     */
    suffix?: string
}

export interface MultiReleaseConfig extends Config {
    /**
     * List of plugin configurations
     */
    configs: PluginConfig[]
}
