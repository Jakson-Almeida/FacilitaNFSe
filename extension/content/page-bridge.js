(function () {
  if (window.__FacilitaNFSePageBridge) return;
  window.__FacilitaNFSePageBridge = true;

  function waitForJQuery(timeoutMs) {
    var started = Date.now();
    return new Promise(function (resolve, reject) {
      function poll() {
        if (window.jQuery) {
          resolve(window.jQuery);
          return;
        }
        if (Date.now() - started > timeoutMs) {
          reject(new Error("jQuery não disponível na página"));
          return;
        }
        setTimeout(poll, 100);
      }
      poll();
    });
  }

  function respond(id, payload) {
    document.dispatchEvent(
      new CustomEvent("FacilitaNFSeBridgeResponse", {
        detail: Object.assign({ id: id }, payload),
      })
    );
  }

  function getSelect2Context($, selectId) {
    var $select = $("#" + selectId);
    if (!$select.length) {
      throw new Error("Select não encontrado: " + selectId);
    }
    if ($select.prop("disabled")) {
      throw new Error("Select desabilitado: " + selectId);
    }
    var instance = $select.data("select2");
    if (!instance) {
      throw new Error("Select2 não inicializado: " + selectId);
    }
    return { $select: $select, instance: instance };
  }

  function closeOtherSelect2($, $select) {
    $(".select2-hidden-accessible").each(function () {
      if (this === $select[0]) return;
      var other = $(this).data("select2");
      if (other && other.isOpen && other.isOpen()) {
        $(this).select2("close");
      }
    });
  }

  function getDropdownSearchInput(instance) {
    if (instance.dropdown && instance.dropdown.$search) {
      var fromDropdown = instance.dropdown.$search.find("input.select2-search__field");
      if (fromDropdown.length) return fromDropdown[0];
    }
    if (instance.$dropdown) {
      var fromContainer = instance.$dropdown.find("input.select2-search__field");
      if (fromContainer.length) return fromContainer[0];
    }
    return null;
  }

  function getDropdownOptions(instance) {
    if (instance.$results) {
      return instance.$results.find(".select2-results__option").toArray();
    }
    return [];
  }

  function isPlaceholderResult(text) {
    if (!text) return true;
    return (
      text.indexOf("Buscando") !== -1 ||
      text.indexOf("Digite") !== -1 ||
      text.indexOf("Nenhum") !== -1 ||
      text.indexOf("Carregando") !== -1
    );
  }

  function normalizeCode(value) {
    return String(value || "").replace(/\s/g, "").replace(/\./g, "");
  }

  function optionMatches(text, optionValue) {
    if (!text || isPlaceholderResult(text)) return false;

    var trimmed = text.trim();
    if (trimmed.indexOf(optionValue) !== -1) return true;

    var codePart = trimmed.split(" - ")[0].trim();
    if (codePart === optionValue) return true;

    var compactValue = normalizeCode(optionValue);
    var compactText = normalizeCode(codePart);
    if (!compactValue || !compactText) return false;

    return (
      compactText.indexOf(compactValue) === 0 ||
      compactValue.indexOf(compactText) === 0
    );
  }

  function setSearchTerm(input, text, $) {
    input.focus();
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    $(input).trigger("input");
    input.dispatchEvent(new Event("keyup", { bubbles: true }));
    $(input).trigger("keyup");
  }

  function applySelect2Value($select, optionValue, optionText) {
    if ($select.val() === optionValue) {
      var instance = $select.data("select2");
      if (instance && instance.isOpen && instance.isOpen()) {
        $select.select2("close");
      }
      return;
    }

    var escaped = optionValue.replace(/"/g, '\\"');
    if (!$select.find('option[value="' + escaped + '"]').length) {
      $select.append(new Option(optionText, optionValue, true, true));
    }

    $select.val(optionValue).trigger("change");

    var instance = $select.data("select2");
    if (instance && instance.isOpen && instance.isOpen()) {
      $select.select2("close");
    }
  }

  function triggerOptionSelection($, optionEl) {
    var $option = $(optionEl);
    $option.trigger("mouseup");
    $option.trigger("click");
  }

  function select2SearchAndSelect(selectId, searchText, optionValue) {
    return waitForJQuery(8000).then(function ($) {
      var ctx = getSelect2Context($, selectId);
      var $select = ctx.$select;
      var instance = ctx.instance;

      if ($select.val() === optionValue) {
        return;
      }

      closeOtherSelect2($, $select);

      return new Promise(function (resolve, reject) {
        var started = Date.now();
        var searchApplied = false;

        $select.select2("open");

        function fail(message) {
          if ($select.val() === optionValue) {
            resolve();
            return;
          }
          reject(new Error(message));
        }

        function trySelectFromResults() {
          if ($select.val() === optionValue) {
            resolve();
            return true;
          }

          var $options = getDropdownOptions(instance);
          for (var i = 0; i < $options.length; i++) {
            var optionEl = $options[i];
            if (optionEl.getAttribute("aria-disabled") === "true") continue;

            var text = (optionEl.textContent || "").trim();
            if (!optionMatches(text, optionValue)) continue;

            triggerOptionSelection($, optionEl);

            setTimeout(function () {
              if ($select.val() === optionValue) {
                resolve();
                return;
              }
              applySelect2Value($select, optionValue, text);
              setTimeout(function () {
                if ($select.val() === optionValue) {
                  resolve();
                } else {
                  fail("Não foi possível selecionar: " + optionValue);
                }
              }, 400);
            }, 300);
            return true;
          }

          return false;
        }

        function waitForSearchField(attempt) {
          var input = getDropdownSearchInput(instance);
          if (input) {
            if (!searchApplied) {
              searchApplied = true;
              setSearchTerm(input, searchText, $);
            }
            pollForOption();
            return;
          }

          if (Date.now() - started > 8000) {
            if (trySelectFromResults()) return;
            fail("Campo de busca Select2 não encontrado: " + selectId);
            return;
          }

          setTimeout(function () {
            waitForSearchField(attempt + 1);
          }, 120);
        }

        function pollForOption() {
          if (trySelectFromResults()) return;

          if (Date.now() - started > 25000) {
            fail("Opção Select2 não encontrada para: " + optionValue);
            return;
          }

          setTimeout(pollForOption, 150);
        }

        setTimeout(function () {
          waitForSearchField(0);
        }, 200);
      });
    });
  }

  document.addEventListener("FacilitaNFSeBridgeRequest", function (event) {
    var detail = event.detail || {};
    var id = detail.id;
    var action = detail.action;
    var args = detail.args || [];

    var work = waitForJQuery(8000).then(function ($) {
      if (action === "select2SearchAndSelect") {
        return select2SearchAndSelect(args[0], args[1], args[2]);
      }

      if (action === "select2Open") {
        $("#" + args[0]).select2("open");
        return;
      }

      if (action === "select2SetVal") {
        var selectId = args[0];
        var value = args[1];
        var label = args[2];
        var $select = $("#" + selectId);

        if (!$select.length) {
          throw new Error("Select não encontrado: " + selectId);
        }

        if (label && !$select.find('option[value="' + value + '"]').length) {
          $select.append(new Option(label, value, true, true));
        }

        $select.val(value).trigger("change");
        return;
      }

      if (action === "chosenUpdate") {
        var chosenId = args[0];
        var chosenValue = args[1];
        var $chosen = $("#" + chosenId);

        if (!$chosen.length) {
          throw new Error("Select não encontrado: " + chosenId);
        }

        $chosen.val(chosenValue).trigger("chosen:updated").trigger("change");
        return;
      }

      throw new Error("Ação desconhecida: " + action);
    });

    work
      .then(function () {
        respond(id, { ok: true });
      })
      .catch(function (error) {
        respond(id, { ok: false, error: error.message || String(error) });
      });
  });
})();
