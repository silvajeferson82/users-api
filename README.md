# Configure CI/CD para seu AWS Lambda com estrutura serverless e GitHub Actions

## O que é CI/CD?

CI/CD significa integração contínua, implantação contínua e entrega contínua. É um processo que aliena os processos manuais de fazer as coisas. É a arte de automatizar o processo de construção, teste, implantação e entrega de aplicativos para seus clientes. Existem diferentes ferramentas usadas para CI/CD, elas incluem Jenkins , GitHub Actions , GitLab CI , CircleCI , Travis CI , Bitbucket Pipelines , AWS CodeBuild , AWS CodeDeploy , AWS CodePipeline e muito mais.

Neste tutorial, usarei AWS, estrutura Serverless e GitHub Actions.

### Github Actions

O GitHub Actions automatiza, personaliza e executa seus fluxos de trabalho de desenvolvimento de software diretamente em seu repositório com o GitHub Actions. Você pode descobrir, criar e compartilhar ações para executar qualquer trabalho que desejar, incluindo CI/CD, e combinar ações em um fluxo de trabalho totalmente personalizado.

## Pré-requisitos para acompanhar:

- Tenha uma conta GitHub
- Bifurque e clone este repositório 
- Crie uma conta da AWS com as seguintes permissões: IAMFullAccess , AmazonS3FullAccess , CloudWatchFullAccess , AWSCloudFormationFullAccess , AWSLambda_FullAccess e AmazonAPIGatewayInvokeFullAccess .
- Armazene a chave de API do usuário da AWS e a chave secreta (mantenha-a segura)

### Crie um arquivo main.yml para definir a configuração do fluxo de trabalho

Depois de marcar todos os pré-requisitos, crie um arquivo chamado main.yml em uma pasta .github/workflowse cole este código

```yml
name: Deploy serverless app

on: 
  push:
    branches:
      - master

jobs:
  deploy:
    name: deploy
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x]
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: serverless deploy
      uses: serverless/github-action@master
      with:
        args: deploy
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```


Um fluxo de trabalho é um processo automatizado configurável composto por um ou mais trabalhos.

## Sintaxe do fluxo de trabalho

**name:** o nome do fluxo de trabalho

**on:** o tipo de evento que pode executar o fluxo de trabalho. Nosso fluxo de trabalho só será executado quando houver um git push para o master ou o branch develop. Leia mais aqui

**jobs:** um fluxo de trabalho consiste em um ou mais trabalhos. Os trabalhos são executados em paralelo, a menos que uma needspalavra-chave seja usada. Cada trabalho é executado em um ambiente de executor especificado porruns-on

**steps:** sequência de tarefas a serem executadas

**use:** seleciona uma ação para executar como parte de uma etapa em seu trabalho. Uma ação é uma unidade de código reutilizável. Leia mais aqui

**with:** um mapa de parâmetros de entrada

**run:** executa programas de linha de comando

**env:** define as variáveis ​​de ambiente

## Adicionar chave de API e chave secreta ao segredo do GitHub
Acesse as **settings** no repositório bifurcado para adicionar a chave de API e a chave secreta. Clique em **Secrets** na navegação lateral à esquerda e clique em **New repository secret** para adicionar seus segredos A chave e o segredo da API nos fornecem acesso programático ao seu ambiente AWS.

<p style="align:center;">
  <a>
  <img src="./assets/Captura de tela_2023-06-10_19-49-45.png" />
  </a>
</p>

## Envie as alterações para o GitHub para iniciar o fluxo de trabalho

Agora você pode confirmar suas alterações localmente e enviá-las para o GitHub. Navegue pelo repositório no GitHub, clique nas ações, você poderá ver seus fluxos de trabalho.

<p style="align:center;">
  <a>
  <img src="./assets/Captura de tela_2023-06-09_23-51-42.png" />
  </a>
</p>

### Conheça mais sobre o [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)

### Conheça mais sobre o [Serverlerss Framework](https://www.serverless.com/framework/docs/providers/aws/guide/intro)

### Conheça mais sobre a [AWS](https://aws.amazon.com/pt/training/)

## Stay in touch

- Author - [Jeferson Silva](https://github.com/silvajeferson82)
- linkedin - [/in/silvajeferson82](https://www.linkedin.com/in/silvajeferson82/)

## License

Nest is [MIT licensed](LICENSE).