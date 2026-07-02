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
  if (window.jQuery) {
    window.jQuery("#" + selectId).trigger("chosen:updated");
    window.jQuery("#" + selectId).trigger("change");
  }
};

FacilitaNFSe.setChosenSelect = function (selectId, value) {
  var select = document.getElementById(selectId);
  if (!select) return false;
  select.value = value;
  FacilitaNFSe.dispatchInput(select);
  FacilitaNFSe.updateChosen(selectId);
  return true;
};

FacilitaNFSe.setSelect2Value = function (selectId, value, label) {
  var $ = window.jQuery;
  if (!$) return Promise.resolve(false);
  var $select = $("#" + selectId);
  if (!$select.length) return Promise.resolve(false);

  if (!$select.find('option[value="' + value + '"]').length && label) {
    var option = new Option(label, value, true, true);
    $select.append(option);
  }

  $select.val(value).trigger("change");
  return Promise.resolve(true);
};

FacilitaNFSe.setSelect2BySearch = function (selectId, searchText, optionValue) {
  var $ = window.jQuery;
  if (!$) return Promise.reject(new Error("jQuery não disponível na página"));

  var $select = $("#" + selectId);
  if (!$select.length) return Promise.reject(new Error("Select não encontrado: " + selectId));

  $select.select2("open");

  return FacilitaNFSe.sleep(300).then(function () {
    var searchField = document.querySelector(
      ".select2-container--open .select2-search__field"
    );
    if (!searchField) {
      throw new Error("Campo de busca Select2 não encontrado");
    }

    searchField.focus();
    searchField.value = searchText;
    searchField.dispatchEvent(new Event("input", { bubbles: true }));
    searchField.dispatchEvent(new Event("keyup", { bubbles: true }));

    return FacilitaNFSe.waitForSelect2Option(optionValue, 8000);
  }).then(function (optionText) {
    var options = document.querySelectorAll(
      ".select2-container--open .select2-results__option"
    );
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.textContent.indexOf(optionValue) !== -1 || option.textContent === optionText) {
        option.click();
        return FacilitaNFSe.sleep(400);
      }
    }
    throw new Error("Opção Select2 não encontrada para: " + optionValue);
  });
};

FacilitaNFSe.waitForSelect2Option = function (match, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      var options = document.querySelectorAll(
        ".select2-container--open .select2-results__option"
      );
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
