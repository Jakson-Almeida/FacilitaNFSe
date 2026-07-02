var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.fillTributacao = function (config, runtime) {
  if (!config) return Promise.resolve({ ok: true, skipped: true });

  var chain = Promise.resolve();
  var valor =
    (runtime && runtime.valorServico) ||
    config.valorServico;

  if (valor) {
    chain = chain.then(function () {
      FacilitaNFSe.setInputById("Valores_ValorServico", valor);
      return FacilitaNFSe.sleep(200);
    });
  }

  if (config.tipoValorTributos) {
    chain = chain.then(function () {
      FacilitaNFSe.clickRadio("ValorTributos.TipoValorTributos", config.tipoValorTributos);
      return FacilitaNFSe.sleep(200);
    });
  }

  return chain.then(function () {
    return { ok: true, step: "tributacao" };
  });
};
