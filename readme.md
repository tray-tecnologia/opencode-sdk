# Opencode SDK

Kit de desenvolvimento feito para interagir com as APIs do Opencode da Tray, facilitando as atualizações e suporte a novas versões. Criado utilizando NodeJs e Typescript.

## Índice

-   [Instalação](#instalação)
-   [Uso](#uso)
    -   [Métodos](#métodos)
    -   [Modo depuração](#modo-depuração)
    -   [Tipos](#tipos)
-   [Contribuições](#contribuições)
-   [Licença](#licença)

## Instalação

Rode o comando abaixo para fazer a instalação desse pacote.

```shell
npm install @tray-tecnologia/opencode-sdk
```

## Uso

Todos os métodos disponíveis no SDK devolvem Promises. Ao serem resolvidas elas retornam os dados da API. Caso sejam rejeitadas possíveis erros podem ter acontecido.

Abaixo um exemplo simples de uso do SDK.

```js
const Sdk = require('opencode-sdk');

const client = new Sdk({
    key: 'YOUR-KEY-HERE',
    password: 'YOUR-PASSWORD-HERE',
    themeId: 1,
    debug: false,
});

client
    .checkConfiguration()
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

### Métodos

#### Construtor

Construtor da classe. Deve-se passar um objeto do tipo [Config](#config). Retorna uma instância de `Api`.

#### .checkConfiguration(): Promise<ApiConfigurationResponse>

Valida se os dados passados na criação do objeto estão corretos. Retorna objeto `ApiConfigurationResponse` se promise for resolvida ou uma instância de `ApiError` caso contrário.

#### .cleanCache(themeId: number = this.themeId): Promise<boolean>

Limpa o cache do tema informado. Caso o parâmetro opcional `themeId` não seja informado, será usado o tema configurado. Retorna `true` se promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .getThemes(): Promise<ApiListThemesResponse>

Obtem a lista de todos os temas disponíveis na loja. Retorna objeto `ApiListThemesResponse` se promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .createTheme(name: string, base: string = 'default'): Promise<ApiCreateThemeResponse>

Cria um tema na loja. Deve ser informado o parâmetro obrigatório `name`, que será o nome do tema na loja. O parâmetro opcional `base` indica qual tema deve ser usado como base para criação desse novo tema. Caso não seja informado, será usado o tema padrão da plataforma. Retorna objeto `ApiCreateThemeResponse` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .deleteTheme(id: number): Promise<boolean>

Remove o tema informado. Retorna `true` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .getAssets(): Promise<ApiAssetsResponse>

Lista todos os arquivos do tema configurado. Retorna objeto `ApiAssetsResponse` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .getAsset(asset: string): Promise<ApiAssetContentResponse>

Obtem o conteúdo do arquivo solicitado. Retorna objeto `ApiAssetContentResponse` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .sendAsset({ asset, data, isBinary }: SendAsset): Promise<boolean>

Cria ou atualiza um arquivo no tema configurado. Deve-se passar um objeto do tipo [SendAsset](#sendasset). Retorna `true` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

#### .deleteAsset(asset: string): Promise<boolean>

Remove um arquivo do tema informado. Deve ser informado o parâmetro `asset` contento o nome do arquivo a ser removido. **Atenção:** ele precisa iniciar com uma barra `/`. Retorna `true` se a promise for resolvida, ou uma instância de `ApiError` caso contrário.

### Modo depuração

O SDK contá com uma opção de depuração. Ao passar o parâmetro `debug: true` na inicialização da API faz com que um arquivo de log seja gerado para toda operação realizada com o SDK. Por padrão essa opção vem desabilitada. O nome do arquivo de depuração gerado é `.debug.sdk.log`. Por iniciar com ponto `.` ele não é enviado para loja.

### Tipos

O Sdk possui alguns tipos especiais que são expostos e podem ser usados.

#### Config

Estrutura com dados para a configuração e conexão com a API da Tray.

```typescript
type Config = {
    key: string;
    password: string;
    themeId: number | null;
    debug?: boolean;
};
```

#### SendAsset

Estrutura com dados para ser enviado a API da Tray para criação e/ou atualização do arquivo.

```typescript
type SendAsset = {
    asset: string;
    data: Buffer;
    isBinary: boolean;
};
```

## Contribuições

Opencode SDK é um projeto de código-fonte aberto no qual todos são bem-vindos a ajudar, contribuindo com o projeto. Fique a vontade para reportar problemas, sugerir melhorias ou enviar código de novas funcionalidades.

## Licença

[GPLv3](license.md)
