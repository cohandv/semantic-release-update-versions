import { exec, execSync } from 'node:child_process'

import type { PublishContext } from 'semantic-release'

import type { DockerConfigType, DockerImageType } from './docker.types.js'
import { getError } from './error.js'
import type { PluginConfig } from './types.js'

export class Docker {
    public static loadConfig(pluginConfig: PluginConfig, context: PublishContext): DockerConfigType {
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

        return {
            imageName: pluginConfig.imageName,
            imageTags: tags,
        }
    }

    public async build(command: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const childProcess = exec(command, (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(true)
                }
            })

            childProcess.stdout?.pipe(process.stdout)
            childProcess.stderr?.pipe(process.stderr)
        })
    }

    public async login(username: string, password: string, registry: string): Promise<boolean> {
        return new Promise((resolve) => {
            const childProcess = exec(
                `docker login ${registry} --username ${username} --password-stdin`,
                (error, stdout) => {
                    if (error) {
                        resolve(false)
                    } else {
                        resolve(stdout.startsWith('Login Succeeded'))
                    }
                },
            )

            childProcess.stdin?.write(password)
            childProcess.stdin?.end()
        })
    }

    public async push(name: string, tags: string[], registry: string): Promise<boolean> {
        const image = this.getImage(name)
        const [, serverAddress] = registry.split('://')

        if (!image) {
            throw new AggregateError([getError('ENOIMAGE')])
        }

        for (const tag of tags) {
            const imageRepository = `${serverAddress}/${image.Repository}:${tag}`

            execSync(`docker tag ${image.ID} ${imageRepository}`)

            await new Promise<void>((resolve, reject) => {
                const childProcess = exec(`docker push ${imageRepository}`, (error) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                })

                childProcess.stdout?.pipe(process.stdout)
                childProcess.stderr?.pipe(process.stderr)
            })

            execSync(`docker rmi ${imageRepository}`)
        }

        return true
    }

    private getImage(name: string): DockerImageType | undefined {
        const stdout = execSync('docker images --format "{{json . }}"').toString('utf-8').match(/.+/gu)

        if (!stdout) {
            return
        }

        return stdout.map<DockerImageType>((value) => JSON.parse(value)).find((image) => image.Repository === name)
    }
}
