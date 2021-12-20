import { ApiError } from './ApiError';

export class UnknownError extends ApiError {
    constructor() {
        super({
            code: 'SDK::9999',
            message: 'Unable to send request to server. Tray again in few moments..',
        });
        this.name = 'UnknownError';
    }
}
