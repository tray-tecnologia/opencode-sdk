export type ApiThemeAssetContentResponse = {
    key: string;
    dynamic: boolean;
    binary: boolean;
    content: Buffer;
    publicUrl?: string;
};
