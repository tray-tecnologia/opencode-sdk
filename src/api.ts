import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { ApiConfigurationResponse } from './responses/ApiConfigurationResponse';
import FailedConfigurationError from './errors/FailedConfigurationError';
import AuthenticationError from './errors/AuthenticationError';
import ApiError from './errors/ApiError';
import UnknownError from './errors/UnknownError';

type config = {
    key: string;
    password: string;
    themeId: number | null;
    debug: boolean;
};

/**
 *
 */
export default class Api {
    readonly version: string = '1.0.4';
    readonly url: string = 'https://opencode.tray.com.br/api';
    readonly debug: boolean;
    readonly key: string;
    readonly password: string;
    readonly themeId: number | null;
    readonly headers: AxiosRequestHeaders;

    /**
     * Initiate new API class instance
     * @param param0
     */
    constructor({ key, password, themeId = null, debug = false }: config) {
        this.key = key;
        this.password = password;
        this.themeId = themeId;
        this.debug = debug;
        this.headers = {
            Authorization: `Token token=${this.key}_${this.password}`,
            Accept: 'application/json',
        };
    }

    /**
     * Check configurations files
     * @returns Object with previewUrl in success case, or error message otherwise.
     */
    checkConfiguration(): Promise<ApiConfigurationResponse | ApiError> {
        const config: AxiosRequestConfig = {
            url: `${this.url}/check`,
            method: 'post',
            headers: this.headers,
            params: {
                gem_version: this.version,
            },
        };

        if (this.themeId) {
            config.params.theme_id = this.themeId;
        }

        return axios
            .request(config)
            .then((response) => {
                const { authentication, theme_id: themeId = null, preview = null } = response.data;
                const data: ApiConfigurationResponse = { authentication, themeId, preview };

                return Promise.resolve(data);
            })
            .catch((error: AxiosError) => {
                let sdkError;

                if (error.response && error.response.data) {
                    if ('authentication' in error.response.data) {
                        sdkError = new FailedConfigurationError(error.response.data);
                    } else {
                        sdkError = new AuthenticationError(error.response.data.message, error.response.data);
                    }
                } else {
                    sdkError = new UnknownError();
                }

                return Promise.reject(sdkError);
            });
    }
}
