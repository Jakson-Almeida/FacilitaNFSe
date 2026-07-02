var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.sleep = function (ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
};

FacilitaNFSe.dispatchInput = function (element) {
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

FacilitaNFSe.setInputValue = function (selector, value) {
  var element = document.querySelector(selector);
  if (!element || value == null || value === "") return false;
  element.focus();
  element.value = value;
  FacilitaNFSe.dispatchInput(element);
  return true;
};

FacilitaNFSe.setInputById = function (id, value) {
  return FacilitaNFSe.setInputValue("#" + id, value);
};

FacilitaNFSe.clickRadio = function (name, value) {
  var selector =
    'input[type="radio"][name="' + name.replace(/\./g, "\\.") + '"][value="' + value + '"]';
  var input = document.querySelector(selector);
  if (!input) return false;
  var label = input.closest("label");
  if (label) {
    label.click();
  } else {
    input.click();
  }
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
};

FacilitaNFSe.setCheckbox = function (id, checked) {
  var element = document.getElementById(id);
  if (!element) return false;
  if (element.checked !== checked) {
    element.click();
  }
  return true;
};

FacilitaNFSe.updateChosen = function (selectId) {
  var select = document.getElementById(selectId);
  if (!select) return Promise.resolve(false);
  return FacilitaNFSe.callPageBridge("chosenUpdate", [selectId, select.value]).catch(function () {
    return false;
  });
};

FacilitaNFSe.setChosenSelect = function (selectId, value) {
  var select = document.getElementById(selectId);
  if (!select) return Promise.resolve(false);
  select.value = value;
  FacilitaNFSe.dispatchInput(select);
  return FacilitaNFSe.callPageBridge("chosenUpdate", [selectId, value]).then(function () {
    return true;
  });
};

FacilitaNFSe.callPageBridge = function (action, args, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var requestId = "fnfse_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    var timeout = timeoutMs || 12000;

    var timer = window.setTimeout(function () {
      document.removeEventListener("FacilitaNFSeBridgeResponse", onResponse);
      reject(new Error("Timeout ao executar ação na página: " + action));
    }, timeout);

    function onResponse(event) {
      var detail = event.detail;
      if (!detail || detail.id !== requestId) return;

      window.clearTimeout(timer);
      document.removeEventListener("FacilitaNFSeBridgeResponse", onResponse);

      if (detail.ok) {
        resolve(detail.result);
      } else {
        reject(new Error(detail.error || "Falha na ponte com a página"));
      }
    }

    document.addEventListener("FacilitaNFSeBridgeResponse", onResponse);
    document.dispatchEvent(
      new CustomEvent("FacilitaNFSeBridgeRequest", {
        detail: {
          id: requestId,
          action: action,
          args: args || [],
        },
      })
    );
  });
};

FacilitaNFSe.openSelect2Dom = function (selectId) {
  var container = document.querySelector("#select2-" + selectId + "-container");
  if (container) {
    container.click();
    return true;
  }

  var select = document.getElementById(selectId);
  if (!select) return false;

  var sibling = select.nextElementSibling;
  if (sibling && sibling.classList.contains("select2")) {
    var selection = sibling.querySelector(".select2-selection");
    if (selection) {
      selection.click();
      return true;
    }
  }

  return false;
};

FacilitaNFSe.openSelect2 = function (selectId) {
  return FacilitaNFSe.callPageBridge("select2Open", [selectId]).catch(function () {
    if (FacilitaNFSe.openSelect2Dom(selectId)) return true;
    throw new Error("Não foi possível abrir Select2: " + selectId);
  });
};

FacilitaNFSe.setSelect2Value = function (selectId, value, label) {
  var select = document.getElementById(selectId);
  if (!select) return Promise.resolve(false);

  if (!select.querySelector('option[value="' + value + '"]') && label) {
    select.appendChild(new Option(label, value, true, true));
  }

  select.value = value;
  FacilitaNFSe.dispatchInput(select);
  return FacilitaNFSe.callPageBridge("select2SetVal", [selectId, value, label || value]).then(function () {
    return FacilitaNFSe.getSelectValue(selectId) === String(value);
  });
};

FacilitaNFSe.setSelect2BySearch = function (selectId, searchText, optionValue) {
  var select = document.getElementById(selectId);
  if (!select) return Promise.reject(new Error("Select não encontrado: " + selectId));

  return FacilitaNFSe.callPageBridge(
    "select2SearchAndSelect",
    [selectId, searchText, optionValue],
    35000
  );
};

FacilitaNFSe.waitForSelect2Option = function (match, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      var options = document.querySelectorAll(".select2-results__option");
      for (var i = 0; i < options.length; i++) {
        var text = options[i].textContent.trim();
        if (text && text.indexOf("Buscando") === -1 && text.indexOf(match) !== -1) {
          resolve(text);
          return;
        }
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("Timeout aguardando opções Select2"));
        return;
      }
      setTimeout(poll, 250);
    }
    poll();
  });
};

FacilitaNFSe.clickButton = function (id) {
  var button = document.getElementById(id);
  if (!button) return false;
  button.click();
  return true;
};

FacilitaNFSe.findAdvanceButton = function () {
  var byId = document.getElementById("btnAvancar");
  if (byId) return byId;

  var comandos = document.querySelector(".comandos");
  if (comandos) {
    var candidates = comandos.querySelectorAll('button[type="submit"], a.btn-primary.direita');
    for (var i = 0; i < candidates.length; i++) {
      var text = (candidates[i].textContent || "").trim();
      if (text.indexOf("Avançar") !== -1) {
        return candidates[i];
      }
    }
  }

  var form = document.querySelector("form.formdps");
  if (form) {
    var submit = form.querySelector('button[type="submit"].btn-primary');
    if (submit) return submit;
  }

  return null;
};

FacilitaNFSe.clickAdvanceButton = function () {
  var button = FacilitaNFSe.findAdvanceButton();
  if (!button) return false;
  button.click();
  return true;
};

FacilitaNFSe.findEmitNfseButton = function () {
  var byId = document.getElementById("btnProsseguir");
  if (byId) return byId;

  var comandos = document.querySelector(".comandos");
  if (comandos) {
    var candidates = comandos.querySelectorAll("a.btn-primary.direita, button.btn-primary.direita");
    for (var i = 0; i < candidates.length; i++) {
      var text = (candidates[i].textContent || "").trim();
      if (text.indexOf("Emitir NFS-e") !== -1 || text.indexOf("Emitir NFSe") !== -1) {
        return candidates[i];
      }
    }
  }

  return null;
};

FacilitaNFSe.clickEmitNfseButton = function () {
  var button = FacilitaNFSe.findEmitNfseButton();
  if (!button) return false;
  button.click();
  return true;
};

FacilitaNFSe.detectNfseSuccess = function () {
  var selectors = [
    ".alert-success",
    ".alert.alert-success",
    ".alert-info.alert",
    ".alert",
  ];

  for (var s = 0; s < selectors.length; s++) {
    var elements = document.querySelectorAll(selectors[s]);
    for (var i = 0; i < elements.length; i++) {
      var text = (elements[i].textContent || "").trim();
      if (/NFS-e foi gerada com sucesso/i.test(text)) {
        return true;
      }
    }
  }

  var bodyText = document.body ? document.body.innerText : "";
  return /NFS-e foi gerada com sucesso/i.test(bodyText);
};

FacilitaNFSe.waitForNfseSuccess = function (timeoutMs, onTick) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      if (FacilitaNFSe.detectNfseSuccess()) {
        resolve(true);
        return;
      }

      if (typeof onTick === "function") {
        onTick();
      }

      if (Date.now() - started > timeoutMs) {
        reject(new Error("Timeout aguardando confirmação de emissão da NFS-e."));
        return;
      }

      setTimeout(poll, 500);
    }

    poll();
  });
};

FacilitaNFSe.getVisibleModal = function () {
  var candidates = document.querySelectorAll(
    ".bootbox.modal, .modal.in, .modal.show, .modal[style*='display: block']"
  );
  for (var i = 0; i < candidates.length; i++) {
    var modal = candidates[i];
    var style = window.getComputedStyle(modal);
    if (style.display !== "none" && style.visibility !== "hidden") {
      return modal;
    }
  }
  return null;
};

FacilitaNFSe.clickModalButtonByText = function (label) {
  var modal = FacilitaNFSe.getVisibleModal();
  if (!modal) return false;

  var target = label.trim().toLowerCase();
  var buttons = modal.querySelectorAll("button");

  for (var i = 0; i < buttons.length; i++) {
    var text = buttons[i].textContent.trim().toLowerCase();
    if (text === target) {
      buttons[i].click();
      return true;
    }
  }
  return false;
};

FacilitaNFSe.waitAndClickModalButton = function (label, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve) {
    function poll() {
      if (FacilitaNFSe.clickModalButtonByText(label)) {
        FacilitaNFSe.sleep(400).then(resolve);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        resolve();
        return;
      }
      setTimeout(poll, 150);
    }
    poll();
  });
};

FacilitaNFSe.dismissVisibleModal = function () {
  if (FacilitaNFSe.clickModalButtonByText("Fechar")) {
    return FacilitaNFSe.sleep(300);
  }
  if (FacilitaNFSe.clickModalButtonByText("Não")) {
    return FacilitaNFSe.sleep(300);
  }
  return Promise.resolve();
};

/**
 * Altera DataCompetencia e confirma o modal do portal, se aparecer.
 */
FacilitaNFSe.setCompetenceDate = function (value) {
  var field = document.getElementById("DataCompetencia");
  if (!field || !value) return Promise.resolve(false);

  if (field.value === value) {
    return Promise.resolve(true);
  }

  FacilitaNFSe.setInputById("DataCompetencia", value);
  return FacilitaNFSe.sleep(300)
    .then(function () {
      return FacilitaNFSe.waitAndClickModalButton("Sim", 6000);
    })
    .then(function () {
      return FacilitaNFSe.dismissVisibleModal();
    })
    .then(function () {
      return field.value === value;
    });
};
