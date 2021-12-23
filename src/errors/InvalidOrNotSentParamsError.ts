import ApiError from './ApiError';

export default class InvalidOrNotSentParamsError extends ApiError {
    constructor(data: object) {
        super({
            code: 'SDK::0003',
            message: 'Required params not sent or invalid param sent.',
            data,
        });
        this.name = 'InvalidOrNotSentParamsError';
    }
}
