var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.isBuiltinTemplateId = function (id) {
  return FacilitaNFSe.DEFAULT_TEMPLATES.some(function (template) {
    return template.id === id;
  });
};

FacilitaNFSe.createEmptyTemplate = function () {
  return {
    id: "",
    name: "",
    pessoas: {
      dataCompetencia: "currentMonth",
      tomador: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
        inscricao: "",
        nome: "",
        buscarInscricao: false,
        informarEndereco: false,
        enderecoNacional: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
        },
      },
      intermediario: {
        localDomicilio: FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO,
      },
    },
    servico: {
      codigoPaisPrestacao: "BR",
      codigoMunicipioPrestacao: "",
      codigoTributacaoNacional: "",
      codigoTributacaoBusca: "",
      haExportacaoImunidadeNaoIncidencia: "0",
      descricao: "",
    },
    tributacao: {
      valorServico: "",
      valorServicoPrompt: true,
      tipoValorTributos: "3",
    },
  };
};

FacilitaNFSe.cloneTemplate = function (template) {
  return JSON.parse(JSON.stringify(template));
};

FacilitaNFSe.slugifyTemplateId = function (name, existingIds) {
  var base = String(name || "template")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 40);

  if (!base) base = "template";

  var id = base;
  var counter = 2;
  while (existingIds.indexOf(id) >= 0) {
    id = base + "-" + counter;
    counter += 1;
  }
  return id;
};

FacilitaNFSe.getNestedValue = function (object, path) {
  return path.split(".").reduce(function (current, key) {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, object);
};

FacilitaNFSe.setNestedValue = function (object, path, value) {
  var keys = path.split(".");
  var current = object;
  for (var i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
};

FacilitaNFSe.sanitizeTemplate = function (template) {
  var clean = FacilitaNFSe.cloneTemplate(template);
  clean.name = String(clean.name || "").trim();

  if (clean.pessoas && clean.pessoas.tomador) {
    var tomador = clean.pessoas.tomador;
    tomador.inscricao = String(tomador.inscricao || "").trim();
    tomador.nome = String(tomador.nome || "").trim();
    if (!tomador.informarEndereco) {
      delete tomador.enderecoNacional;
    } else if (tomador.enderecoNacional) {
      Object.keys(tomador.enderecoNacional).forEach(function (key) {
        tomador.enderecoNacional[key] = String(tomador.enderecoNacional[key] || "").trim();
      });
    }
    if (tomador.localDomicilio === FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO) {
      delete clean.pessoas.tomador;
    }
  }

  if (clean.servico) {
    clean.servico.codigoMunicipioPrestacao = String(
      clean.servico.codigoMunicipioPrestacao || ""
    ).trim();
    clean.servico.codigoTributacaoNacional = String(
      clean.servico.codigoTributacaoNacional || ""
    ).trim();
    clean.servico.codigoTributacaoBusca = String(
      clean.servico.codigoTributacaoBusca || ""
    ).trim();
    clean.servico.descricao = String(clean.servico.descricao || "").trim();
    if (!clean.servico.codigoMunicipioPrestacao) {
      delete clean.servico.codigoMunicipioPrestacao;
    }
    if (!clean.servico.codigoTributacaoBusca) {
      delete clean.servico.codigoTributacaoBusca;
    }
  }

  if (clean.tributacao) {
    clean.tributacao.valorServico = String(clean.tributacao.valorServico || "").trim();
    if (clean.tributacao.valorServicoPrompt) {
      delete clean.tributacao.valorServico;
    } else if (!clean.tributacao.valorServico) {
      delete clean.tributacao.valorServico;
    }
  }

  return clean;
};

FacilitaNFSe.validateTemplate = function (template, existingIds, originalId) {
  var errors = [];
  var clean = FacilitaNFSe.sanitizeTemplate(template);

  if (!clean.name) {
    errors.push("Informe o nome do template.");
  }

  if (!clean.id) {
    errors.push("ID do template inválido.");
  } else if (originalId && clean.id !== originalId && existingIds.indexOf(clean.id) >= 0) {
    errors.push("Já existe um template com este ID.");
  } else if (!originalId && existingIds.indexOf(clean.id) >= 0) {
    errors.push("Já existe um template com este ID.");
  }

  if (!clean.servico || !clean.servico.codigoTributacaoNacional) {
    errors.push("Informe o código de tributação nacional (passo Serviço).");
  }
  if (!clean.servico || !clean.servico.descricao) {
    errors.push("Informe a descrição do serviço (passo Serviço).");
  }

  return errors;
};
