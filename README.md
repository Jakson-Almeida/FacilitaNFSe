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

Este repositório está em fase inicial. A extensão ainda não foi implementada; este README documenta a ideia e o escopo do projeto.

## Instalação

> Disponível após a primeira versão publicada.

1. Clone o repositório
2. Carregue a extensão no Chrome em `chrome://extensions` (modo desenvolvedor → "Carregar sem compactação")
3. Acesse o [Emissor Nacional NFS-e](https://www.nfse.gov.br/EmissorNacional/) e configure seus templates

## Como contribuir

Contribuições serão bem-vindas assim que a base do projeto estiver estruturada. Sugestões de campos recorrentes, melhorias de UX e correções de mapeamento de formulários são especialmente úteis.

## Aviso legal

O FacilitaNFSe **não é um produto oficial** do governo federal nem está afiliado ao portal NFS-e. É uma ferramenta independente que interage com a interface web do emissor nacional. O usuário permanece responsável por revisar todos os dados antes de emitir a nota fiscal.

## Licença

A definir.
