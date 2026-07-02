var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.getEmitenteMunicipio = function () {
  var hidden = document.getElementById("hdfCodMunEmi");
  return hidden ? hidden.value : null;
};

FacilitaNFSe.getMunicipioPrestacaoLabel = function (code) {
  var hidden = document.getElementById("LocalPrestacao_DescricaoMunicipioPrestacao");
  if (hidden && hidden.value) return hidden.value;

  var label = FacilitaNFSe.getSelectLabel("LocalPrestacao_CodigoMunicipioPrestacao");
  if (label) return label;

  return code;
};

FacilitaNFSe.getCodigoTributacaoSearchTerm = function (codigo, customBusca) {
  if (customBusca) return customBusca;
  var parts = String(codigo || "").split(".");
  if (parts.length >= 2) {
    return parts[0] + "." + parts[1];
  }
  return String(codigo || "").replace(/\./g, "").substring(0, 4);
};

FacilitaNFSe.waitForRadioEnabled = function (name, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      var input = document.querySelector(
        'input[type="radio"][name="' + name.replace(/\./g, "\\.") + '"]:not([disabled])'
      );
      if (input) {
        resolve(input);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("Campo não habilitou: " + name));
        return;
      }
      setTimeout(poll, 200);
    }
    poll();
  });
};

FacilitaNFSe.waitForSelectValue = function (selectId, expectedValue, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      if (FacilitaNFSe.getSelectValue(selectId) === String(expectedValue)) {
        resolve(true);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("Select não atualizou: " + selectId));
        return;
      }
      setTimeout(poll, 200);
    }
    poll();
  });
};

FacilitaNFSe.isCodigoTributacaoSelected = function (codigo) {
  return FacilitaNFSe.getSelectValue("ServicoPrestado_CodigoTributacaoNacional") === String(codigo);
};

FacilitaNFSe.fillCodigoTributacao = function (codigo, searchTerm, options) {
  if (FacilitaNFSe.isCodigoTributacaoSelected(codigo)) {
    return Promise.resolve(null);
  }

  if (
    !FacilitaNFSe.shouldApplyField(
      "codigoTributacao",
      FacilitaNFSe.getSelectValue("ServicoPrestado_CodigoTributacaoNacional"),
      codigo,
      options
    )
  ) {
    return Promise.resolve(null);
  }

  return FacilitaNFSe.setSelect2BySearch(
    "ServicoPrestado_CodigoTributacaoNacional",
    searchTerm,
    codigo
  ).catch(function (error) {
    if (FacilitaNFSe.isCodigoTributacaoSelected(codigo)) {
      return null;
    }
    throw error;
  }).then(function () {
    if (FacilitaNFSe.isCodigoTributacaoSelected(codigo)) {
      return FacilitaNFSe.sleep(400);
    }
    return FacilitaNFSe.waitForSelectValue(
      "ServicoPrestado_CodigoTributacaoNacional",
      codigo,
      8000
    );
  });
};

FacilitaNFSe.waitForEnabled = function (id, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      var element = document.getElementById(id);
      if (element && !element.disabled && !element.readOnly) {
        resolve(element);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("Campo não habilitou: " + id));
        return;
      }
      setTimeout(poll, 200);
    }
    poll();
  });
};

FacilitaNFSe.fillMunicipioPrestacao = function (municipio, config, options) {
  var current = FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoMunicipioPrestacao");
  if (!FacilitaNFSe.shouldApplyField("municipioPrestacao", current, municipio, options)) {
    return Promise.resolve(null);
  }

  var label =
    (config && config.descricaoMunicipioPrestacao) ||
    FacilitaNFSe.getMunicipioPrestacaoLabel(municipio);
  var searchTerm = String(municipio).length >= 4 ? String(municipio).substring(0, 4) : String(municipio);

  return FacilitaNFSe.setSelect2Value(
    "LocalPrestacao_CodigoMunicipioPrestacao",
    municipio,
    label
  ).then(function (applied) {
    if (applied && FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoMunicipioPrestacao") === String(municipio)) {
      return FacilitaNFSe.sleep(300);
    }
    return FacilitaNFSe.setSelect2BySearch(
      "LocalPrestacao_CodigoMunicipioPrestacao",
      searchTerm,
      municipio
    );
  });
};

FacilitaNFSe.fillServico = function (config, options) {
  if (!config) return Promise.resolve({ ok: true, skipped: true });
  options = options || {};

  var chain = Promise.resolve();
  var municipio = config.codigoMunicipioPrestacao || FacilitaNFSe.getEmitenteMunicipio();

  if (config.codigoPaisPrestacao) {
    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "paisPrestacao",
          FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoPaisPrestacao"),
          config.codigoPaisPrestacao,
          options
        )
      ) {
        return FacilitaNFSe.setChosenSelect(
          "LocalPrestacao_CodigoPaisPrestacao",
          config.codigoPaisPrestacao
        );
      }
      return null;
    }).then(function () {
      return FacilitaNFSe.sleep(400);
    });
  }

  if (municipio) {
    chain = chain.then(function () {
      return FacilitaNFSe.fillMunicipioPrestacao(municipio, config, options);
    });
  }

  if (config.codigoTributacaoNacional) {
    var searchTerm = FacilitaNFSe.getCodigoTributacaoSearchTerm(
      config.codigoTributacaoNacional,
      config.codigoTributacaoBusca
    );

    chain = chain.then(function () {
      return FacilitaNFSe.waitForEnabled("ServicoPrestado_CodigoTributacaoNacional", 10000);
    });

    chain = chain.then(function () {
      return FacilitaNFSe.fillCodigoTributacao(
        config.codigoTributacaoNacional,
        searchTerm,
        options
      );
    });

    chain = chain.then(function () {
      return FacilitaNFSe.waitForRadioEnabled(
        "ServicoPrestado.HaExportacaoImunidadeNaoIncidencia",
        15000
      );
    });
  }

  if (config.haExportacaoImunidadeNaoIncidencia != null) {
    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "imunidadeExportacao",
          FacilitaNFSe.getRadioValue("ServicoPrestado.HaExportacaoImunidadeNaoIncidencia"),
          config.haExportacaoImunidadeNaoIncidencia,
          options
        )
      ) {
        FacilitaNFSe.clickRadio(
          "ServicoPrestado.HaExportacaoImunidadeNaoIncidencia",
          config.haExportacaoImunidadeNaoIncidencia
        );
      }
      return FacilitaNFSe.sleep(300);
    });
  }

  if (config.descricao) {
    chain = chain.then(function () {
      return FacilitaNFSe.waitForEnabled("ServicoPrestado_Descricao", 15000);
    });

    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "descricaoServico",
          FacilitaNFSe.getInputValue("ServicoPrestado_Descricao"),
          config.descricao,
          options
        )
      ) {
        var textarea = document.getElementById("ServicoPrestado_Descricao");
        if (textarea) {
          textarea.readOnly = false;
          textarea.disabled = false;
          textarea.value = config.descricao;
          FacilitaNFSe.dispatchInput(textarea);
        }
      }
      return FacilitaNFSe.sleep(200);
    });
  }

  return chain.then(function () {
    return { ok: true, step: "servico" };
  });
};
