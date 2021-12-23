import ApiError from './ApiError';

export default class UnknownError extends ApiError {
    constructor(message?: string) {
        super({
            code: 'SDK::9999',
            message: message ?? 'Unable to process request. Tray again in few moments..',
        });
        this.name = 'UnknownError';
    }
}
