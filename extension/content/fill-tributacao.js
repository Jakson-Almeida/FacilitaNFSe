var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.fillTributacao = function (config, runtime, options) {
  if (!config) return Promise.resolve({ ok: true, skipped: true });
  options = options || {};

  var chain = Promise.resolve();
  var valor = (runtime && runtime.valorServico) || config.valorServico;

  if (valor) {
    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "valorServico",
          FacilitaNFSe.getInputValue("Valores_ValorServico"),
          valor,
          options
        )
      ) {
        FacilitaNFSe.setInputById("Valores_ValorServico", valor);
      }
      return FacilitaNFSe.sleep(200);
    });
  }

  if (config.tipoValorTributos) {
    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "tipoValorTributos",
          FacilitaNFSe.getRadioValue("ValorTributos.TipoValorTributos"),
          config.tipoValorTributos,
          options
        )
      ) {
        FacilitaNFSe.clickRadio("ValorTributos.TipoValorTributos", config.tipoValorTributos);
      }
      return FacilitaNFSe.sleep(200);
    });
  }

  return chain.then(function () {
    return { ok: true, step: "tributacao" };
  });
};
