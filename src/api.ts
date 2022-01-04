import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import ApiError from './errors/ApiError';
import AuthenticationError from './errors/AuthenticationError';
import FailedConfigurationError from './errors/FailedConfigurationError';
import InvalidLayoutError from './errors/InvalidLayoutError';
import InvalidOrNotSentParamsError from './errors/InvalidOrNotSentParamsError';
import UnknownError from './errors/UnknownError';
import { ApiConfigurationResponse } from './responses/ApiConfigurationResponse';
import { ApiCreateThemeResponse } from './responses/ApiCreateThemeResponse';
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
    getThemes(): Promise<ApiListThemesResponse | ApiError> {
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

    /**
     * Create a new theme on store.
     * @param name Name of the new theme
     * @param base Name of the base theme
     * @returns Promise ApiCreateThemeResponse if promise resolves, or ApiError otherwise.
     */
    createTheme(name: string, base: string = 'default'): Promise<ApiCreateThemeResponse | ApiError> {
        const config: AxiosRequestConfig = {
            url: `${this.url}/themes`,
            method: 'post',
            headers: this.headers,
            params: {
                gem_version: this.version,
            },
            data: {
                theme: {
                    name,
                    theme_base: base,
                    gem_version: this.version,
                },
            },
        };

        return axios
            .request(config)
            .then((response) => {
                const { theme_id: themeId, name, preview, published } = response.data;
                const data: ApiCreateThemeResponse = { themeId, name, preview, published };

                return Promise.resolve(data);
            })
            .catch((error: AxiosError) => {
                let sdkError;

                sdkError = this.verifyAuthenticationError(error);

                if (!sdkError && error.response && error.response.data.code == '00101') {
                    sdkError = new InvalidOrNotSentParamsError(error.response.data);
                }

                return Promise.reject(sdkError || new UnknownError());
            });
    }

    /**
     * Clean cache for a theme on store
     * @param {number|null} themeId Theme id to clean cache.
     * @returns Promise Return true with promises resolve, or ApiError otherwise.
     */
    cleanCache(themeId = this.themeId): Promise<boolean | ApiError> {
        const config: AxiosRequestConfig = {
            url: `${this.url}/clean_cache/`,
            method: 'post',
            headers: this.headers,
            params: {
                theme_id: themeId,
                gem_version: this.version,
            },
        };

        return axios
            .request(config)
            .then((response) => {
                if (response.data.response.code === 200) {
                    throw new UnknownError(`Unknown error. Details: ${response.data.response.message}`);
                }

                return Promise.resolve(true);
            })
            .catch((error: AxiosError | ApiError) => {
                let sdkError;

                if (error instanceof ApiError) {
                    sdkError = error;
                } else {
                    sdkError = this.verifyAuthenticationError(error);
                }

                return Promise.reject(sdkError || new UnknownError());
            });
    }

    /**
     * Delete a theme from store
     * @param id Theme id to delete
     * @returns Promise Return true with promises resolve, or ApiError otherwise.
     */
    deleteTheme(id: number): Promise<boolean | ApiError> {
        const config: AxiosRequestConfig = {
            url: `${this.url}/themes/${id}`,
            method: 'delete',
            headers: this.headers,
            params: {
                gem_version: this.version,
            },
        };

        return axios
            .request(config)
            .then((response) => {
                return Promise.resolve(true);
            })
            .catch((error: AxiosError): Promise<boolean | ApiError> => {
                let sdkError = this.verifyAuthenticationError(error);

                if (!sdkError && error.response && error.response.data.message) {
                    if (error.response.data.message.includes("undefined method `id'")) {
                        return Promise.resolve(true);
                    } else if (error.response.data.code == '00301') {
                        sdkError = new InvalidLayoutError(error.response.data);
                    }
                }

                return Promise.reject(sdkError || new UnknownError());
            });
    }
}
