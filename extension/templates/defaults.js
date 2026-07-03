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
 *       inscricaoPrompt?: boolean,    // pedir CPF/CNPJ ao usuário no painel
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
      dataCompetencia: "previousMonth",
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
        "Prestação de serviço de intermediação de negócios (Programa de Afiliados Shopee) referente às comissões do período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "mercado-livre-afiliados",
    name: "Mercado Livre — Afiliados / Comissões",
    pessoas: {
      dataCompetencia: "previousMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricao: "03.007.331/0001-41",
        nome: "EBAZAR.COM.BR LTDA",
        buscarInscricao: true,
        informarEndereco: true,
        enderecoNacional: {
          logradouro: "Avenida das Nações Unidas",
          numero: "3003",
          bairro: "Bonfim",
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
        "Prestação de serviços de divulgação e intermediação de negócios (Programa de Afiliados Mercado Livre) referente às comissões do período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "amazon-associados",
    name: "Amazon — Programa de Associados",
    pessoas: {
      dataCompetencia: "previousMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricao: "15.436.940/0001-03",
        nome: "AMAZON SERVICOS DE VAREJO DO BRASIL LTDA",
        buscarInscricao: true,
        informarEndereco: true,
        enderecoNacional: {
          logradouro: "Avenida Presidente Juscelino Kubitschek",
          numero: "2041",
          bairro: "Vila Nova Conceicao",
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
        "Prestação de serviços de divulgação e intermediação de negócios (Programa de Associados Amazon.com.br) referente às comissões do período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "hotmart-taxas",
    name: "Hotmart — Taxas de plataforma / saque",
    pessoas: {
      dataCompetencia: "previousMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricao: "13.427.325/0001-05",
        nome: "LAUNCH PAD TECNOLOGIA, SERVICOS E PAGAMENTOS LTDA",
        buscarInscricao: true,
        informarEndereco: true,
        enderecoNacional: {
          logradouro: "Avenida Assis Chateaubriand",
          numero: "499",
          bairro: "Floresta",
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
        "Prestação de serviços de intermediação e divulgação referente às taxas de saque/intermediação cobradas pela Hotmart no período. (Comissões de afiliado ao produtor usam o CNPJ do infoprodutor.)",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "youtube-google-brasil",
    name: "YouTube — Google Brasil (monetização)",
    pessoas: {
      dataCompetencia: "previousMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricao: "06.990.590/0001-23",
        nome: "GOOGLE BRASIL INTERNET LTDA.",
        buscarInscricao: true,
        informarEndereco: true,
        enderecoNacional: {
          logradouro: "Avenida Brigadeiro Faria Lima",
          numero: "3477",
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
        "Prestação de serviços de publicidade e conteúdo digital (monetização YouTube / Google AdSense) referente ao período. Valide com seu contador: pagamentos do exterior podem exigir tomador estrangeiro.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "dev-sistemas",
    name: "Desenvolvimento de sistemas (cliente PJ)",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricaoPrompt: true,
        buscarInscricao: true,
      },
      intermediario: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
      },
    },
    servico: {
      codigoPaisPrestacao: "BR",
      codigoTributacaoNacional: "01.01.01",
      codigoTributacaoBusca: "01.01",
      haExportacaoImunidadeNaoIncidencia: "0",
      descricao:
        "Prestação de serviços de análise e desenvolvimento de sistemas conforme demanda/contrato, referente ao período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "suporte-ti",
    name: "Suporte técnico em informática (cliente PJ)",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricaoPrompt: true,
        buscarInscricao: true,
      },
      intermediario: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
      },
    },
    servico: {
      codigoPaisPrestacao: "BR",
      codigoTributacaoNacional: "01.07.01",
      codigoTributacaoBusca: "01.07",
      haExportacaoImunidadeNaoIncidencia: "0",
      descricao:
        "Prestação de serviços de suporte técnico em informática, inclusive instalação, configuração e manutenção, referente ao período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "consultoria",
    name: "Consultoria / assessoria (cliente PJ)",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricaoPrompt: true,
        buscarInscricao: true,
      },
      intermediario: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
      },
    },
    servico: {
      codigoPaisPrestacao: "BR",
      codigoTributacaoNacional: "17.01.01",
      codigoTributacaoBusca: "17.01",
      haExportacaoImunidadeNaoIncidencia: "0",
      descricao:
        "Prestação de serviços de assessoria e consultoria conforme contrato, referente ao período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "engenharia",
    name: "Engenharia / projetos técnicos (cliente PJ)",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricaoPrompt: true,
        buscarInscricao: true,
      },
      intermediario: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
      },
    },
    servico: {
      codigoPaisPrestacao: "BR",
      codigoTributacaoNacional: "07.01.01",
      codigoTributacaoBusca: "07.01",
      haExportacaoImunidadeNaoIncidencia: "0",
      descricao:
        "Prestação de serviços de engenharia e elaboração de projetos técnicos conforme contrato, referente ao período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
  {
    id: "design-marketing",
    name: "Design e marketing digital (cliente PJ)",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.BRASIL,
        inscricaoPrompt: true,
        buscarInscricao: true,
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
        "Prestação de serviços de design, propaganda e marketing digital conforme contrato, referente ao período.",
    },
    tributacao: {
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  },
];
