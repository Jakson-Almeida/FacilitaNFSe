/**
 * Schema de template FacilitaNFSe (3 passos editáveis)
 *
 * {
 *   id: string,
 *   name: string,
 *   pessoas?: {
 *     dataCompetencia?: string | "previousMonth" | "currentMonth",
 *     tomador?: {
 *       localDomicilio: "0" | "1" | "2",
 *       inscricao?: string,           // CPF/CNPJ
 *       nome?: string,                // fallback se busca CNPJ não preencher
 *       buscarInscricao?: boolean,    // clica em pesquisar CPF/CNPJ
 *       informarEndereco?: boolean,
 *       enderecoNacional?: {
 *         cep?, logradouro?, numero?, complemento?, bairro?
 *       }
 *     },
 *     intermediario?: {
 *       localDomicilio: "0" | "1" | "2"
 *     }
 *   },
 *   servico?: {
 *     codigoPaisPrestacao?: string,              // ex: "BR"
 *     codigoMunicipioPrestacao?: string,         // código IBGE
 *     codigoTributacaoNacional: string,          // ex: "17.06.01"
 *     codigoTributacaoBusca?: string,            // termo Select2 (min. 3 chars)
 *     haExportacaoImunidadeNaoIncidencia?: "0" | "1",
 *     descricao: string
 *   },
 *   tributacao?: {
 *     valorServico?: string,                     // ex: "150,00"
 *     valorServicoPrompt?: boolean,              // pedir ao usuário no popup
 *     tipoValorTributos?: "1" | "2" | "3" | "4" // MEI: "3" = não informar
 *   }
 * }
 */

var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.DEFAULT_TEMPLATES = [
  {
    id: "shopee-afiliados",
    name: "Shopee — Programa de Afiliados",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricao: "35.635.824/0001-12",
        nome: "SHPS TECNOLOGIA E SERVICOS LTDA.",
        buscarInscricao: true,
        informarEndereco: true,
        enderecoNacional: {
          logradouro: "Avenida Brigadeiro Faria Lima",
          numero: "3732",
          bairro: "Itaim Bibi",
          complemento: "",
        },
      },
      intermediario: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
      },
    },
    servico: {
      codigoPaisPrestacao: "BR",
      codigoTributacaoNacional: "17.06.01",
      codigoTributacaoBusca: "17.06",
      haExportacaoImunidadeNaoIncidencia: "0",
      descricao:
        "Prestação de serviço de intermediação de negócios (Programa de afiliados Shopee) referente às comissões faturadas no último mês.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
];
