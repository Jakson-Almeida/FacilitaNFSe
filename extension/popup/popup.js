var stepLabel = document.getElementById("step-label");
var templateSelect = document.getElementById("template-select");
var valorGroup = document.getElementById("valor-group");
var valorInput = document.getElementById("valor-servico");
var applyBtn = document.getElementById("apply-btn");
var statusEl = document.getElementById("status");

var currentStep = null;
var templates = [];

var STEP_LABELS = {
  pessoas: "Passo 1 — Pessoas",
  servico: "Passo 2 — Serviço",
  tributacao: "Passo 3 — Valores",
  emitir: "Passo 4 — Revisão (sem preenchimento)",
};

function setStatus(message, type) {
  statusEl.textContent = message || "";
  statusEl.className = "status" + (type ? " " + type : "");
}

function normalizeValor(value) {
  var trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (trimmed.indexOf(",") === -1 && /^\d+(\.\d+)?$/.test(trimmed)) {
    return trimmed.replace(".", ",");
  }
  return trimmed;
}

function updateValorFieldVisibility() {
  var template = templates.find(function (item) {
    return item.id === templateSelect.value;
  });
  var needsValor =
    currentStep === "tributacao" &&
    template &&
    template.tributacao &&
    template.tributacao.valorServicoPrompt;

  valorGroup.classList.toggle("hidden", !needsValor);
}

function renderTemplates(list) {
  templateSelect.innerHTML = "";
  list.forEach(function (template) {
    var option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    templateSelect.appendChild(option);
  });
  updateValorFieldVisibility();
}

function getActiveTab() {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!tabs.length) {
        reject(new Error("Nenhuma aba ativa."));
        return;
      }
      resolve(tabs[0]);
    });
  });
}

function sendToTab(tabId, message) {
  return new Promise(function (resolve, reject) {
    chrome.tabs.sendMessage(tabId, message, function (response) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

function detectStepFromTab(tab) {
  if (!tab.url || tab.url.indexOf("/EmissorNacional/DPS/") === -1) {
    currentStep = null;
    stepLabel.textContent = "Abra uma página do Emissor Nacional (DPS).";
    applyBtn.disabled = true;
    return Promise.resolve();
  }

  return sendToTab(tab.id, { action: "getStep" })
    .then(function (response) {
      currentStep = response && response.step;
      stepLabel.textContent = STEP_LABELS[currentStep] || "Página DPS desconhecida";
      applyBtn.disabled = !currentStep || currentStep === "emitir";
      updateValorFieldVisibility();
    })
    .catch(function () {
      currentStep = FacilitaNFSe.detectStep(new URL(tab.url).pathname);
      stepLabel.textContent = currentStep
        ? STEP_LABELS[currentStep]
        : "Recarregue a página do emissor e tente de novo.";
      applyBtn.disabled = !currentStep || currentStep === "emitir";
      updateValorFieldVisibility();
    });
}

function applyTemplate() {
  setStatus("Aplicando...", null);
  applyBtn.disabled = true;

  getActiveTab()
    .then(function (tab) {
      var template = templates.find(function (item) {
        return item.id === templateSelect.value;
      });
      if (!template) {
        throw new Error("Selecione um template.");
      }

      var runtime = {};
      if (
        currentStep === "tributacao" &&
        template.tributacao &&
        template.tributacao.valorServicoPrompt
      ) {
        var valor = normalizeValor(valorInput.value);
        if (!valor) {
          throw new Error("Informe o valor do serviço.");
        }
        runtime.valorServico = valor;
      }

      return sendToTab(tab.id, {
        action: "applyTemplate",
        templateId: template.id,
        runtime: runtime,
      });
    })
    .then(function (response) {
      if (!response || !response.ok) {
        throw new Error((response && response.error) || "Falha ao aplicar template.");
      }
      setStatus("Template aplicado com sucesso.", "ok");
    })
    .catch(function (error) {
      setStatus(error.message || String(error), "error");
    })
    .finally(function () {
      applyBtn.disabled = !currentStep || currentStep === "emitir";
    });
}

templateSelect.addEventListener("change", updateValorFieldVisibility);
applyBtn.addEventListener("click", applyTemplate);

FacilitaNFSe.loadTemplates().then(function (list) {
  templates = list;
  renderTemplates(list);
  return getActiveTab();
}).then(function (tab) {
  return detectStepFromTab(tab);
}).catch(function (error) {
  setStatus(error.message || String(error), "error");
});
