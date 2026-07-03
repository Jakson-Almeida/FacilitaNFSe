var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.applyTemplateOnPage = function (template, runtime, options) {
  var step = FacilitaNFSe.detectStep(window.location.pathname);
  if (!step) {
    return Promise.reject(new Error("Esta página não faz parte do fluxo DPS."));
  }
  if (step === "emitir" || step === "nfse") {
    return Promise.reject(
      new Error("O passo de emissão não usa template. Use Emitir NFS-e no painel.")
    );
  }

  var stepConfig = template[step];
  if (!stepConfig) {
    return Promise.reject(new Error("Template sem dados para o passo: " + step));
  }

  options = options || { overwriteAll: false, overwriteFields: [] };

  if (step === "pessoas") {
    return FacilitaNFSe.fillPessoas(stepConfig, runtime, options);
  }
  if (step === "servico") {
    return FacilitaNFSe.fillServico(stepConfig, options);
  }
  if (step === "tributacao") {
    return FacilitaNFSe.fillTributacao(stepConfig, runtime, options);
  }

  return Promise.reject(new Error("Passo não suportado: " + step));
};

FacilitaNFSe.observeStepChanges = function () {
  var lastPath = window.location.pathname + window.location.search;
  window.setInterval(function () {
    var currentPath = window.location.pathname + window.location.search;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      if (FacilitaNFSe.Panel && FacilitaNFSe.Panel.root) {
        FacilitaNFSe.Panel.refresh();
      }
    }
  }, 800);
};

FacilitaNFSe.initPanel();
FacilitaNFSe.observeStepChanges();

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message.action === "getStep") {
    sendResponse({
      step: FacilitaNFSe.detectStep(window.location.pathname),
      url: window.location.href,
      readyToAdvance: FacilitaNFSe.isStepReadyToAdvance(
        FacilitaNFSe.detectStep(window.location.pathname)
      ),
    });
    return false;
  }

  if (message.action === "scanTemplate") {
    FacilitaNFSe.getTemplateById(message.templateId)
      .then(function (template) {
        if (!template) throw new Error("Template não encontrado.");
        var step = FacilitaNFSe.detectStep(window.location.pathname);
        sendResponse({
          ok: true,
          scan: FacilitaNFSe.scanStep(step, template, message.runtime || {}),
        });
      })
      .catch(function (error) {
        sendResponse({ ok: false, error: error.message || String(error) });
      });
    return true;
  }

  if (message.action === "applyTemplate") {
    FacilitaNFSe.getTemplateById(message.templateId)
      .then(function (template) {
        if (!template) {
          throw new Error("Template não encontrado.");
        }
        return FacilitaNFSe.applyTemplateOnPage(
          template,
          message.runtime || {},
          message.options || {}
        );
      })
      .then(function (result) {
        sendResponse({ ok: true, result: result });
      })
      .catch(function (error) {
        sendResponse({ ok: false, error: error.message || String(error) });
      });
    return true;
  }

  if (message.action === "togglePanel") {
    if (!FacilitaNFSe.Panel.root) {
      FacilitaNFSe.initPanel();
    } else {
      FacilitaNFSe.Panel.root.classList.remove("fn-collapsed");
      var toggle = document.getElementById("fn-toggle");
      if (toggle) toggle.textContent = "−";
    }
    sendResponse({ ok: true });
    return false;
  }

  return false;
});
