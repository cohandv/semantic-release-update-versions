class SemanticReleaseError extends Error {
    // @ts-expect-error
    private code?: string

    // @ts-expect-error
    private details?: string

    // @ts-expect-error
    private readonly semanticRelease = true

    constructor(message: string, code?: string, details?: string) {
        super(message)
        Error.captureStackTrace(this, this.constructor)
        this.name = 'SemanticReleaseError'
        this.code = code
        this.details = details
    }
}

type ErrorCodesType =
    | 'EBUILD'
    | 'EDEPLOY'
    | 'ENOAUTHENTICATION'
    | 'ENOAUTHORIZATION'
    | 'ENOIMAGE'
    | 'ENOIMAGENAME'
    | 'ENOREGION'

export function getError(code: ErrorCodesType): SemanticReleaseError {
    switch (code) {
        case 'ENOREGION': {
            return new SemanticReleaseError(
                'No aws region specified.',
                'ENOREGION',
                'An aws region must be created and set ' +
                    'in the `AWS_DEFAULT_REGION` environment variable on your CI environment.',
            )
        }

        case 'ENOAUTHORIZATION': {
            return new SemanticReleaseError('Error with aws authorization.', 'ENOAUTHORIZATION')
        }

        case 'ENOAUTHENTICATION': {
            return new SemanticReleaseError('Error with docker authentication.', 'ENOAUTHENTICATION')
        }

        case 'ENOIMAGENAME': {
            return new SemanticReleaseError('No docker image specified.', 'ENOIMAGENAME')
        }

        case 'EBUILD': {
            return new SemanticReleaseError('Error executing docker build.', 'EBUILD')
        }

        case 'ENOIMAGE': {
            return new SemanticReleaseError('No docker image found with provided name.', 'ENOIMAGE')
        }

        case 'EDEPLOY': {
            return new SemanticReleaseError('Error executing docker push.', 'EDEPLOY')
        }

        default: {
            return new SemanticReleaseError('Unknown error occurred.')
        }
    }
}
