import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { ApiConfigurationResponse } from './responses/ApiConfigurationResponse';
import FailedConfigurationError from './errors/FailedConfigurationError';
import AuthenticationError from './errors/AuthenticationError';
import ApiError from './errors/ApiError';
import UnknownError from './errors/UnknownError';
import { ApiListThemesResponse } from './responses/ApiListThemesResponse';

type config = {
    key: string;
    password: string;
    themeId: number | null;
    debug?: boolean;
};

/**
 * Opencode api main class
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
     * Initiate API class instance
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
     * Verify response error to detect Authentication error from API
     * @param {AxiosError} error Response error from Axios
     * @return {AuthenticationError | boolean} Returns AuthenticationError instance in case of Authentication error, false otherwise.
     */
    private verifyAuthenticationError(error: AxiosError): AuthenticationError | boolean {
        if (error.response) {
            const { data } = error.response;

            if (data.message == 'Token de acesso inválido' && data.code == '00001' && data.status == 401) {
                return new AuthenticationError(data.message, data);
            }
        }

        return false;
    }

    /**
     * Check configurations files
     * @returns Promise to be resolved. ApiConfigurationResponse if resolved. ApiError otherwise.
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

                sdkError = this.verifyAuthenticationError(error);

                if (!sdkError) {
                    if (error.response && 'authentication' in error.response.data) {
                        sdkError = new FailedConfigurationError(error.response.data);
                    }
                }

                return Promise.reject(sdkError || new UnknownError());
            });
    }

    /**
     * Get a list of all themes available at store
     * @returns Promise ApiListThemesResponse if promise resolves, or ApiError otherwise.
     */
    getThemes(): Promise<any> {
        const config: AxiosRequestConfig = {
            url: `${this.url}/list`,
            method: 'get',
            headers: this.headers,
            params: {
                gem_version: this.version,
            },
        };

        return axios
            .request<ApiListThemesResponse>(config)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch((error: AxiosError) => {
                let sdkError;

                sdkError = this.verifyAuthenticationError(error);

                return Promise.reject(sdkError || new UnknownError());
            });
    }
}
