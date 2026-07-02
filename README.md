# FacilitaNFSe

Extensão para Google Chrome que facilita o preenchimento de Notas Fiscais de Serviço eletrônicas (NFS-e) no [Portal Nacional NFS-e](https://www.nfse.gov.br/EmissorNacional/).

A emissão de NFS-e exige preencher dezenas de campos em formulários longos e repetitivos. O FacilitaNFSe permite criar **templates de preenchimento** e aplicá-los automaticamente nas páginas do emissor nacional, reduzindo tempo e erros de digitação.

## O problema

Quem emite NFS-e com frequência — prestadores de serviço, MEIs, contadores — repete os mesmos dados em praticamente toda nota: tomador, serviço prestado, valores, retenções, município de incidência, entre outros. O [Emissor Nacional](https://www.nfse.gov.br/EmissorNacional/) não oferece memória de preenchimento entre emissões, o que torna o processo lento e suscetível a inconsistências.

## A solução

O FacilitaNFSe funciona como uma camada sobre os formulários do portal:

1. **Criar templates** — o usuário define conjuntos de valores para campos que se repetem (dados do tomador, descrição do serviço, alíquotas, etc.).
2. **Aplicar na página** — ao acessar o emissor nacional, a extensão detecta os formulários e preenche os campos com base no template selecionado.
3. **Revisar e emitir** — o usuário confere os dados preenchidos, ajusta o que for específico daquela nota e conclui a emissão normalmente no portal.

Os templates ficam salvos localmente no navegador do usuário.

## Funcionalidades previstas

- Criação, edição e exclusão de templates de preenchimento
- Preenchimento automático de formulários em `nfse.gov.br/EmissorNacional`
- Seleção rápida de template antes ou durante o preenchimento
- Interface simples para mapear campos do template aos campos da página
- Armazenamento local dos templates (sem envio de dados a servidores externos)

## Público-alvo

- Prestadores de serviço que emitem NFS-e pelo portal nacional
- MEIs e pequenas empresas com emissão recorrente
- Contadores e escritórios que auxiliam clientes na emissão

## Status do projeto

Versão inicial (`0.1.0`) com preenchimento automático nos **passos 1–3** do fluxo DPS (Pessoas, Serviço, Valores). O passo 4 (Emitir NFS-e) é apenas revisão.

### Templates incluídos

| Template | Uso |
|----------|-----|
| **Shopee — Programa de Afiliados** | Tomador Shopee (CNPJ `35.635.824/0001-12`), código `17.06.01`, competência do mês anterior, valor informado na hora |

### Estrutura de um template

Cada template define campos por passo:

- **pessoas** — competência, tomador (CNPJ + busca automática), intermediário
- **servico** — município de prestação (padrão: município do emitente), código de tributação, descrição
- **tributacao** — valor do serviço (`valorServicoPrompt: true` pede no popup), tipo de tributos estimados

Arquivo de referência: `extension/templates/defaults.js`

## Instalação (modo desenvolvedor)

1. Clone o repositório
2. Abra `chrome://extensions` no Chrome
3. Ative **Modo do desenvolvedor**
4. Clique em **Carregar sem compactação** e selecione a pasta `extension/`
5. Acesse o [Emissor Nacional NFS-e](https://www.nfse.gov.br/EmissorNacional/) e inicie uma **Emissão Completa**
6. Em cada passo (1–3), clique no ícone da extensão, escolha o template e **Aplicar neste passo**

> **Importante:** recarregue a página do emissor após instalar ou atualizar a extensão, para o content script ser injetado.

## Como contribuir

Contribuições serão bem-vindas assim que a base do projeto estiver estruturada. Sugestões de campos recorrentes, melhorias de UX e correções de mapeamento de formulários são especialmente úteis.

## Aviso legal

O FacilitaNFSe **não é um produto oficial** do governo federal nem está afiliado ao portal NFS-e. É uma ferramenta independente que interage com a interface web do emissor nacional. O usuário permanece responsável por revisar todos os dados antes de emitir a nota fiscal.

## Licença

A definir.
