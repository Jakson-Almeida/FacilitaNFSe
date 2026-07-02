var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.getEmitenteMunicipio = function () {
  var hidden = document.getElementById("hdfCodMunEmi");
  return hidden ? hidden.value : null;
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
        FacilitaNFSe.setChosenSelect(
          "LocalPrestacao_CodigoPaisPrestacao",
          config.codigoPaisPrestacao
        );
      }
      return FacilitaNFSe.sleep(300);
    });
  }

  if (municipio) {
    chain = chain.then(function () {
      var current = FacilitaNFSe.getSelectValue("LocalPrestacao_CodigoMunicipioPrestacao");
      if (!FacilitaNFSe.shouldApplyField("municipioPrestacao", current, municipio, options)) {
        return null;
      }
      return FacilitaNFSe.setSelect2BySearch(
        "LocalPrestacao_CodigoMunicipioPrestacao",
        municipio,
        municipio
      );
    });
  }

  if (config.codigoTributacaoNacional) {
    var searchTerm =
      config.codigoTributacaoBusca ||
      config.codigoTributacaoNacional.replace(/\./g, "").substring(0, 4);

    chain = chain.then(function () {
      var current = FacilitaNFSe.getSelectValue("ServicoPrestado_CodigoTributacaoNacional");
      if (
        !FacilitaNFSe.shouldApplyField(
          "codigoTributacao",
          current,
          config.codigoTributacaoNacional,
          options
        )
      ) {
        return null;
      }
      return FacilitaNFSe.setSelect2BySearch(
        "ServicoPrestado_CodigoTributacaoNacional",
        searchTerm,
        config.codigoTributacaoNacional
      );
    });

    chain = chain.then(function () {
      return FacilitaNFSe.waitForEnabled("ServicoPrestado_Descricao", 8000);
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
      return FacilitaNFSe.sleep(200);
    });
  }

  if (config.descricao) {
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
