import { ApiError } from './ApiError';

export class FailedRemoveDynamicFile extends ApiError {
    constructor(data: object) {
        super({
            code: 'SDK::0007',
            message: 'Failed to remove dynamic file. Please try again soon.',
            data,
        });
        this.name = 'FailedRemoveDynamicFile';
    }
}
