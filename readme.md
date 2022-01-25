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
npm install @tray/opencode-sdk
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

Cria uma instancia da classe. Deve-se passar um objeto do tipo `Config` contendo `key`, `password`, `themeId` e `debug`. Retorna uma instancia de `Api`.

#### .checkConfiguration()

Valida se os dados passados na criação do objeto estão corretos.

#### .getThemes()

Obtem a lista de todos os temas disponíveis na loja. Retorna objeto `ApiListThemesResponse` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

#### .createTheme(name: string, base: string = 'default')

Cria um novo tema na loja. Deve ser informado o parâmetro obrigatório `name`, que será o nome do tema na loja. O parâmetro opcional `base` indica qual tema deve ser usado como base para criação desse novo tema. Caso não informado, será usado o tema padrão da plataforma. Retorna objeto `ApiCreateThemeResponse` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

#### .cleanCache(themeId: number = this.themeId)

Limpa o cache de loja para o tema informado. Caso o parâmetro opcional `themeId` não seja informado, será usado por padrão o tema configurado. Retorna `true` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

#### .deleteTheme(id: number)

Remove o tema informado. Retorna `true` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

#### .getThemeAssets()

Lista todos os arquivos do tema configurado. Retorna objeto `ApiThemeAssetsResponse` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

#### .getThemeAsset(asset: string)

Obtem o conteúdo do arquivo solicitado. Retorna objeto `ApiThemeAssetContentResponse` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

#### .sendThemeAsset({ asset, data, isBinary }: SendAsset)

Cria ou atualiza um arquivo no tema configurado. Deve-se passar um objeto do tipo `SendAsset` contendo `asset`, `data` e `isBinary`, no qual `asset` é o nome do arquivo, `data` é seu conteúdo, e `isBinary` indica se o conteúdo é binário ou não.

#### .deleteThemeAsset(asset: string)

Remove um arquivo do tema informado. `asset` deve conter o nome do arquivo a ser removido. **Atenção:** ele precisa iniciar com uma barra `/`. Retorna `true` se Promise for resolvida, ou uma instancia de `ApiError` caso contrário.

### Modo depuração

O SDK contá com uma opção de depuração. Ao passar o parâmetro `debug: true` na inicialização da API faz com que um arquivo de log seja gerado para toda operação realizada com o SDK. Por padrão essa opção vem desabilitada. O nome do arquivo de depuração gerado é `.debug.sdk.log`. Por iniciar com ponto `.` ele não é enviado para os a loja.

### Tipos

O Sdk possui alguns tipos especiais que são expostos e podem ser usados.

#### Config

Estrutura com dados pra a configuração e conexão com a API da Tray.

```typescript
type Config = {
    key: string;
    password: string;
    themeId: number | null;
    debug?: boolean;
};
```

#### SendAssets

Estrutura com dados para ser enviado a API da Tray para criação e/ou atualização do arquivo.

```typescript
type SendAsset = {
    asset: string;
    data: Buffer;
    isBinary: boolean;
};
```

## Contribuições

Opencode SDK é um projeto de código fonte aberto no qual todos são bem-vindos a ajudar a comunidade contribuindo com o projeto. Fique a vontade para reportar problemas, sugerir melhorias ou enviar código de novas funcionalidades.

## Licença

[GPLv3](license.md)
