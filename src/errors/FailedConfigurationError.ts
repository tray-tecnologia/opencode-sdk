import ApiError from './ApiError';

export default class FailedConfigurationError extends ApiError {
    constructor(data: object) {
        super({
            code: 'SDK::0002',
            message: 'Theme configuration incorrect, maybe theme id is not valid. Please verify and try again.',
            data,
        });
        this.name = 'FailedConfigurationError';
    }
}
