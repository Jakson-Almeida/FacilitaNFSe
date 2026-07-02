var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.applyTemplateOnPage = function (template, runtime) {
  var step = FacilitaNFSe.detectStep(window.location.pathname);
  if (!step) {
    return Promise.reject(new Error("Esta página não faz parte do fluxo DPS."));
  }
  if (step === "emitir") {
    return Promise.reject(
      new Error("O passo Emitir NFS-e é só revisão. Volte a Pessoas, Serviço ou Valores.")
    );
  }

  var stepConfig = template[step];
  if (!stepConfig) {
    return Promise.reject(new Error("Template sem dados para o passo: " + step));
  }

  if (step === "pessoas") {
    return FacilitaNFSe.fillPessoas(stepConfig);
  }
  if (step === "servico") {
    return FacilitaNFSe.fillServico(stepConfig);
  }
  if (step === "tributacao") {
    return FacilitaNFSe.fillTributacao(stepConfig, runtime);
  }

  return Promise.reject(new Error("Passo não suportado: " + step));
};

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message.action === "getStep") {
    sendResponse({
      step: FacilitaNFSe.detectStep(window.location.pathname),
      url: window.location.href,
    });
    return false;
  }

  if (message.action === "applyTemplate") {
    FacilitaNFSe.getTemplateById(message.templateId)
      .then(function (template) {
        if (!template) {
          throw new Error("Template não encontrado.");
        }
        return FacilitaNFSe.applyTemplateOnPage(template, message.runtime || {});
      })
      .then(function (result) {
        sendResponse({ ok: true, result: result });
      })
      .catch(function (error) {
        sendResponse({ ok: false, error: error.message || String(error) });
      });
    return true;
  }

  return false;
});
