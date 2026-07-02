var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.STEP_ORDER = ["pessoas", "servico", "tributacao", "emitir"];

FacilitaNFSe.STEP_LABELS = {
  pessoas: "Passo 1 — Pessoas",
  servico: "Passo 2 — Serviço",
  tributacao: "Passo 3 — Valores",
  emitir: "Passo 4 — Revisão",
};

FacilitaNFSe.normalizeFieldValue = function (value) {
  return String(value == null ? "" : value)
    .trim()
    .replace(/\s+/g, " ");
};

FacilitaNFSe.valuesDiffer = function (current, proposed) {
  var normalizedCurrent = FacilitaNFSe.normalizeFieldValue(current);
  var normalizedProposed = FacilitaNFSe.normalizeFieldValue(proposed);
  if (!normalizedCurrent || !normalizedProposed) return false;
  return normalizedCurrent !== normalizedProposed;
};

FacilitaNFSe.getInputValue = function (id) {
  var element = document.getElementById(id);
  if (!element) return "";
  if (element.type === "checkbox") return element.checked ? "true" : "false";
  return element.value || "";
};

FacilitaNFSe.getRadioValue = function (name) {
  var checked = document.querySelector(
    'input[type="radio"][name="' + name.replace(/\./g, "\\.") + '"]:checked'
  );
  return checked ? checked.value : "";
};

FacilitaNFSe.getSelectValue = function (id) {
  var select = document.getElementById(id);
  if (!select) return "";
  if (select.selectedIndex >= 0) {
    var option = select.options[select.selectedIndex];
    return option.value || option.text || "";
  }
  return select.value || "";
};

FacilitaNFSe.getSelectLabel = function (id) {
  var select = document.getElementById(id);
  if (!select || select.selectedIndex < 0) return "";
  return select.options[select.selectedIndex].text || "";
};

FacilitaNFSe.shouldApplyField = function (fieldKey, currentValue, proposedValue, options) {
  options = options || {};
  if (proposedValue == null || proposedValue === "") return false;

  var current = FacilitaNFSe.normalizeFieldValue(currentValue);
  var proposed = FacilitaNFSe.normalizeFieldValue(proposedValue);

  if (!current) return true;
  if (current === proposed) return false;

  if (options.overwriteAll) return true;
  if (options.overwriteFields && options.overwriteFields.indexOf(fieldKey) >= 0) {
    return true;
  }
  return false;
};

FacilitaNFSe.classifyField = function (currentValue, proposedValue) {
  if (proposedValue == null || proposedValue === "") {
    return "skip";
  }
  var current = FacilitaNFSe.normalizeFieldValue(currentValue);
  var proposed = FacilitaNFSe.normalizeFieldValue(proposedValue);
  if (!current) return "empty";
  if (current === proposed) return "match";
  return "conflict";
};

FacilitaNFSe.buildPessoasFields = function (config) {
  if (!config) return [];

  var fields = [];

  if (config.dataCompetencia) {
    fields.push({
      key: "competence",
      label: "Data de Competência",
      getCurrent: function () {
        return FacilitaNFSe.getInputValue("DataCompetencia");
      },
      getProposed: function () {
        return FacilitaNFSe.resolveCompetence(config.dataCompetencia);
      },
    });
  }

  if (config.tomador) {
    fields.push({
      key: "tomadorLocal",
      label: "Tomador — localização",
      getCurrent: function () {
        return FacilitaNFSe.getRadioValue("Tomador.LocalDomicilio");
      },
      getProposed: function () {
        return config.tomador.localDomicilio;
      },
      displayValue: function (value) {
        return FacilitaNFSe.formatLocalDomicilio(value);
      },
    });

    if (config.tomador.inscricao) {
      fields.push({
        key: "tomadorInscricao",
        label: "Tomador — CPF/CNPJ",
        getCurrent: function () {
          return FacilitaNFSe.getInputValue("Tomador_Inscricao");
        },
        getProposed: function () {
          return config.tomador.inscricao;
        },
      });
    }

    if (config.tomador.nome) {
      fields.push({
        key: "tomadorNome",
        label: "Tomador — Nome/Razão Social",
        getCurrent: function () {
          return FacilitaNFSe.getInputValue("Tomador_Nome");
        },
        getProposed: function () {
          return config.tomador.nome;
        },
      });
    }

    if (config.tomador.enderecoNacional) {
      var enderecoMap = [
        ["tomadorCep", "Tomador — CEP", "Tomador_EnderecoNacional_CEP", "cep"],
        ["tomadorLogradouro", "Tomador — Logradouro", "Tomador_EnderecoNacional_Logradouro", "logradouro"],
        ["tomadorNumero", "Tomador — Número", "Tomador_EnderecoNacional_Numero", "numero"],
        ["tomadorBairro", "Tomador — Bairro", "Tomador_EnderecoNacional_Bairro", "bairro"],
      ];

      enderecoMap.forEach(function (item) {
        var proposed = config.tomador.enderecoNacional[item[3]];
        if (!proposed) return;
        fields.push({
          key: item[0],
          label: item[1],
          getCurrent: function () {
            return FacilitaNFSe.getInputValue(item[2]);
          },
          getProposed: function () {
            return proposed;
          },
        });
      });
    }
  }

  if (config.intermediario) {
    fields.push({
      key: "intermediarioLocal",
      label: "Intermediário — localização",
      getCurrent: function () {
        return FacilitaNFSe.getRadioValue("Intermediario.LocalDomicilio");
      },
      getProposed: function () {
        return config.intermediario.localDomicilio;
      },
      displayValue: function (value) {
        return FacilitaNFSe.formatLocalDomicilio(value);
      },
    });
  }

  return fields;
};

FacilitaNFSe.buildServicoFields = function (config) {
  if (!config) return [];

  var fields = [];

  if (config.codigoPaisPrestacao) {
    fields.push({
      key: "paisPrestacao",
      label: "País da prestação",
      getCurrent: function () {
        return FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoPaisPrestacao");
      },
      getProposed: function () {
        return config.codigoPaisPrestacao;
      },
    });
  }

  var municipio = config.codigoMunicipioPrestacao || FacilitaNFSe.getEmitenteMunicipio();
  if (municipio) {
    fields.push({
      key: "municipioPrestacao",
      label: "Município da prestação",
      getCurrent: function () {
        return FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoMunicipioPrestacao");
      },
      getProposed: function () {
        return municipio;
      },
      displayValue: function (value) {
        if (!value) return "";
        if (/^\d+$/.test(String(value))) {
          var label = FacilitaNFSe.getSelectLabel("LocalPrestacao_CodigoMunicipioPrestacao");
          if (label && FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoMunicipioPrestacao") === String(value)) {
            return label;
          }
        }
        return value;
      },
    });
  }

  if (config.codigoTributacaoNacional) {
    fields.push({
      key: "codigoTributacao",
      label: "Código de Tributação Nacional",
      getCurrent: function () {
        return FacilitaNFSe.getSelectValue("ServicoPrestado_CodigoTributacaoNacional");
      },
      getProposed: function () {
        return config.codigoTributacaoNacional;
      },
      displayValue: function (value) {
        if (!value) return "";
        var label = FacilitaNFSe.getSelectLabel("ServicoPrestado_CodigoTributacaoNacional");
        if (label && FacilitaNFSe.getSelectValue("ServicoPrestado_CodigoTributacaoNacional") === String(value)) {
          return label;
        }
        return value;
      },
    });
  }

  if (config.haExportacaoImunidadeNaoIncidencia != null) {
    fields.push({
      key: "imunidadeExportacao",
      label: "Imunidade/exportação ISSQN",
      getCurrent: function () {
        return FacilitaNFSe.getRadioValue("ServicoPrestado.HaExportacaoImunidadeNaoIncidencia");
      },
      getProposed: function () {
        return config.haExportacaoImunidadeNaoIncidencia;
      },
      displayValue: function (value) {
        return value === "1" ? "Sim" : "Não";
      },
    });
  }

  if (config.descricao) {
    fields.push({
      key: "descricaoServico",
      label: "Descrição do serviço",
      getCurrent: function () {
        return FacilitaNFSe.getInputValue("ServicoPrestado_Descricao");
      },
      getProposed: function () {
        return config.descricao;
      },
    });
  }

  return fields;
};

FacilitaNFSe.buildTributacaoFields = function (config, runtime) {
  if (!config) return [];

  var fields = [];
  var valor = (runtime && runtime.valorServico) || config.valorServico;

  if (valor) {
    fields.push({
      key: "valorServico",
      label: "Valor do serviço",
      getCurrent: function () {
        return FacilitaNFSe.getInputValue("Valores_ValorServico");
      },
      getProposed: function () {
        return valor;
      },
    });
  }

  if (config.tipoValorTributos) {
    fields.push({
      key: "tipoValorTributos",
      label: "Tributos estimados",
      getCurrent: function () {
        return FacilitaNFSe.getRadioValue("ValorTributos.TipoValorTributos");
      },
      getProposed: function () {
        return config.tipoValorTributos;
      },
      displayValue: function (value) {
        return FacilitaNFSe.formatTipoValorTributos(value);
      },
    });
  }

  return fields;
};

FacilitaNFSe.formatLocalDomicilio = function (value) {
  if (value === FacilitaNFSe.LOCAL_DOMICILIO.NAO_INFORMADO) return "Não informado";
  if (value === FacilitaNFSe.LOCAL_DOMICILIO.BRASIL) return "Brasil";
  if (value === FacilitaNFSe.LOCAL_DOMICILIO.EXTERIOR) return "Exterior";
  return value;
};

FacilitaNFSe.formatTipoValorTributos = function (value) {
  var map = {
    "1": "Valores monetários",
    "2": "Percentuais",
    "3": "Não informar estimados",
    "4": "Alíquota Simples Nacional",
  };
  return map[value] || value;
};

FacilitaNFSe.buildStepFields = function (step, config, runtime) {
  if (step === "pessoas") return FacilitaNFSe.buildPessoasFields(config);
  if (step === "servico") return FacilitaNFSe.buildServicoFields(config);
  if (step === "tributacao") return FacilitaNFSe.buildTributacaoFields(config, runtime);
  return [];
};

FacilitaNFSe.scanStep = function (step, template, runtime) {
  var config = template[step];
  var definitions = FacilitaNFSe.buildStepFields(step, config, runtime);
  var fields = definitions.map(function (definition) {
    var current = definition.getCurrent();
    var proposed = definition.getProposed();
    var display = definition.displayValue || function (value) {
      return value;
    };
    return {
      key: definition.key,
      label: definition.label,
      current: current,
      proposed: proposed,
      currentDisplay: display(current),
      proposedDisplay: display(proposed),
      status: FacilitaNFSe.classifyField(current, proposed),
    };
  });

  return {
    step: step,
    fields: fields,
    conflicts: fields.filter(function (field) {
      return field.status === "conflict";
    }),
    toFill: fields.filter(function (field) {
      return field.status === "empty";
    }),
    matching: fields.filter(function (field) {
      return field.status === "match";
    }),
  };
};


FacilitaNFSe.isStepReadyToAdvance = function (step) {
  if (step === "emitir") return true;

  if (step === "pessoas") {
    return !!FacilitaNFSe.getInputValue("DataCompetencia");
  }
  if (step === "servico") {
    return (
      !!FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoMunicipioPrestacao") &&
      !!FacilitaNFSe.getSelectValue("ServicoPrestado_CodigoTributacaoNacional") &&
      !!FacilitaNFSe.getInputValue("ServicoPrestado_Descricao")
    );
  }
  if (step === "tributacao") {
    return (
      !!FacilitaNFSe.getInputValue("Valores_ValorServico") &&
      !!FacilitaNFSe.getRadioValue("ValorTributos.TipoValorTributos")
    );
  }
  return false;
};
