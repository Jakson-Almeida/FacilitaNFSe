var stepLabel = document.getElementById("step-label");
var openPanelBtn = document.getElementById("open-panel-btn");
var statusEl = document.getElementById("status");

var STEP_LABELS = {
  pessoas: "Passo 1 — Pessoas",
  servico: "Passo 2 — Serviço",
  tributacao: "Passo 3 — Valores",
  emitir: "Passo 4 — Revisão",
};

function setStatus(message, type) {
  statusEl.textContent = message || "";
  statusEl.className = "status" + (type ? " " + type : "");
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

getActiveTab()
  .then(function (tab) {
    if (!tab.url || tab.url.indexOf("/EmissorNacional/DPS/") === -1) {
      stepLabel.textContent = "Abra uma página do Emissor Nacional (DPS).";
      openPanelBtn.disabled = true;
      return;
    }

    var step = FacilitaNFSe.detectStep(new URL(tab.url).pathname);
    stepLabel.textContent = STEP_LABELS[step] || "Página DPS";
    return sendToTab(tab.id, { action: "togglePanel" });
  })
  .catch(function (error) {
    stepLabel.textContent = "Recarregue a página do emissor.";
    setStatus(error.message || String(error), "error");
  });

openPanelBtn.addEventListener("click", function () {
  getActiveTab()
    .then(function (tab) {
      return sendToTab(tab.id, { action: "togglePanel" });
    })
    .then(function () {
      setStatus("Painel exibido na página.", "ok");
    })
    .catch(function (error) {
      setStatus(error.message || String(error), "error");
    });
});
