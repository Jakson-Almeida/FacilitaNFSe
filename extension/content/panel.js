var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.Panel = {
  root: null,
  templates: [],
  currentStep: null,
  pendingApply: null,
  selectedTemplateId: null,

  init: function () {
    if (document.getElementById("facilita-nfse-panel")) return;

    var panel = document.createElement("div");
    panel.id = "facilita-nfse-panel";
    panel.innerHTML =
      '<div class="fn-header">' +
      "<strong>FacilitaNFSe</strong>" +
      '<button type="button" id="fn-toggle" title="Recolher">−</button>' +
      "</div>" +
      '<div class="fn-body">' +
      '<p class="fn-step" id="fn-step-label">Detectando passo...</p>' +
      '<div id="fn-main-controls">' +
      "<label for=\"fn-template\">Template</label>" +
      '<select id="fn-template"></select>' +
      '<div id="fn-template-actions" class="fn-actions-row">' +
      '<button type="button" class="fn-btn fn-btn-secondary" id="fn-new-template">Novo</button>' +
      '<button type="button" class="fn-btn fn-btn-secondary" id="fn-edit-template">Editar</button>' +
      '<button type="button" class="fn-btn fn-btn-secondary" id="fn-duplicate-template">Duplicar</button>' +
      "</div>" +
      '<div id="fn-valor-group" class="fn-hidden">' +
      "<label for=\"fn-valor\">Valor do serviço (R$)</label>" +
      '<input id="fn-valor" type="text" inputmode="decimal" placeholder="150,00" />' +
      "</div>" +
      '<button type="button" class="fn-btn fn-btn-primary" id="fn-apply">Aplicar template</button>' +
      "</div>" +
      '<div id="fn-editor" class="fn-hidden">' +
      '<div class="fn-editor-header">' +
      '<h3 id="fn-editor-title">Novo template</h3>' +
      '<button type="button" class="fn-link-btn" id="fn-editor-back">Voltar</button>' +
      "</div>" +
      '<div class="fn-editor-scroll" id="fn-editor-form"></div>' +
      '<div class="fn-actions-row">' +
      '<button type="button" class="fn-btn fn-btn-secondary fn-hidden" id="fn-editor-delete">Excluir</button>' +
      '<button type="button" class="fn-btn fn-btn-primary" id="fn-editor-save">Salvar template</button>' +
      "</div>" +
      "</div>" +
      '<div id="fn-conflicts" class="fn-conflicts fn-hidden">' +
      "<h3>Campos já preenchidos</h3>" +
      '<p class="fn-summary">Alguns campos têm valores diferentes do template. Marque os que deseja sobrescrever.</p>' +
      '<ul class="fn-conflict-list" id="fn-conflict-list"></ul>' +
      '<label><input type="checkbox" id="fn-overwrite-all" /> Sobrescrever todos os conflitos deste passo</label>' +
      '<div class="fn-actions-row">' +
      '<button type="button" class="fn-btn fn-btn-secondary" id="fn-cancel-conflicts">Cancelar</button>' +
      '<button type="button" class="fn-btn fn-btn-primary" id="fn-confirm-conflicts">Confirmar e aplicar</button>' +
      "</div>" +
      "</div>" +
      '<p class="fn-status" id="fn-status" aria-live="polite"></p>' +
      '<button type="button" class="fn-btn fn-btn-success fn-hidden" id="fn-advance">Avançar</button>' +
      '<button type="button" class="fn-btn fn-btn-success fn-hidden" id="fn-finish">Concluir</button>' +
      "</div>";

    document.body.appendChild(panel);
    this.root = panel;

    document.getElementById("fn-toggle").addEventListener("click", this.toggleCollapsed.bind(this));
    document.getElementById("fn-apply").addEventListener("click", this.onApplyClick.bind(this));
    document.getElementById("fn-cancel-conflicts").addEventListener("click", this.hideConflicts.bind(this));
    document.getElementById("fn-confirm-conflicts").addEventListener("click", this.onConfirmConflicts.bind(this));
    document.getElementById("fn-overwrite-all").addEventListener("change", this.onOverwriteAllChange.bind(this));
    document.getElementById("fn-advance").addEventListener("click", this.onAdvanceClick.bind(this));
    document.getElementById("fn-finish").addEventListener("click", this.onFinishClick.bind(this));
    document.getElementById("fn-template").addEventListener("change", this.onTemplateChange.bind(this));
    document.getElementById("fn-new-template").addEventListener("click", this.onNewTemplate.bind(this));
    document.getElementById("fn-edit-template").addEventListener("click", this.onEditTemplate.bind(this));
    document.getElementById("fn-duplicate-template").addEventListener("click", this.onDuplicateTemplate.bind(this));
    document.getElementById("fn-editor-back").addEventListener("click", function () {
      FacilitaNFSe.TemplateEditor.close();
    });
    document.getElementById("fn-editor-save").addEventListener("click", function () {
      FacilitaNFSe.TemplateEditor.save();
    });
    document.getElementById("fn-editor-delete").addEventListener("click", function () {
      FacilitaNFSe.TemplateEditor.remove();
    });

    FacilitaNFSe.loadTemplates().then(
      function (templates) {
        FacilitaNFSe.Panel.templates = templates;
        FacilitaNFSe.Panel.renderTemplates();
        FacilitaNFSe.Panel.refresh();
      }
    );
  },

  toggleCollapsed: function () {
    this.root.classList.toggle("fn-collapsed");
    var toggle = document.getElementById("fn-toggle");
    toggle.textContent = this.root.classList.contains("fn-collapsed") ? "+" : "−";
  },

  setStatus: function (message, type) {
    var status = document.getElementById("fn-status");
    status.textContent = message || "";
    status.className = "fn-status" + (type ? " " + type : "");
  },

  renderTemplates: function () {
    var select = document.getElementById("fn-template");
    select.innerHTML = "";
    this.templates.forEach(function (template) {
      var option = document.createElement("option");
      option.value = template.id;
      option.textContent = template.name;
      select.appendChild(option);
    });
    if (this.selectedTemplateId) {
      select.value = this.selectedTemplateId;
    }
  },

  getSelectedTemplate: function () {
    var select = document.getElementById("fn-template");
    return this.templates.find(function (template) {
      return template.id === select.value;
    });
  },

  normalizeValor: function (value) {
    var trimmed = (value || "").trim();
    if (!trimmed) return "";
    if (trimmed.indexOf(",") === -1 && /^\d+(\.\d+)?$/.test(trimmed)) {
      return trimmed.replace(".", ",");
    }
    return trimmed;
  },

  buildRuntime: function (template) {
    var runtime = {};
    if (
      this.currentStep === "tributacao" &&
      template.tributacao &&
      template.tributacao.valorServicoPrompt
    ) {
      runtime.valorServico = this.normalizeValor(document.getElementById("fn-valor").value);
    }
    return runtime;
  },

  updateValorVisibility: function () {
    var template = this.getSelectedTemplate();
    var needsValor =
      this.currentStep === "tributacao" &&
      template &&
      template.tributacao &&
      template.tributacao.valorServicoPrompt;
    document.getElementById("fn-valor-group").classList.toggle("fn-hidden", !needsValor);
  },

  onDuplicateTemplate: function () {
    var template = this.getSelectedTemplate();
    if (!template) {
      this.setStatus("Selecione um template para duplicar.", "error");
      return;
    }
    FacilitaNFSe.TemplateEditor.openDuplicate(template);
  },

  onNewTemplate: function () {
    FacilitaNFSe.TemplateEditor.openNew();
  },

  onEditTemplate: function () {
    var template = this.getSelectedTemplate();
    if (!template) {
      this.setStatus("Selecione um template para editar.", "error");
      return;
    }
    FacilitaNFSe.TemplateEditor.openEdit(template);
  },

  onTemplateChange: function () {
    this.selectedTemplateId = document.getElementById("fn-template").value;
    this.updateValorVisibility();
    this.hideConflicts();
  },

  refresh: function () {
    if (document.getElementById("fn-editor") && !document.getElementById("fn-editor").classList.contains("fn-hidden")) {
      return;
    }

    this.currentStep = FacilitaNFSe.detectStep(window.location.pathname);
    var stepLabel = document.getElementById("fn-step-label");
    var applyBtn = document.getElementById("fn-apply");
    var mainControls = document.getElementById("fn-main-controls");
    var advanceBtn = document.getElementById("fn-advance");
    var finishBtn = document.getElementById("fn-finish");

    stepLabel.textContent =
      FacilitaNFSe.STEP_LABELS[this.currentStep] || "Fora do fluxo DPS";

    var onEditableStep = this.currentStep && this.currentStep !== "emitir";
    mainControls.classList.toggle("fn-hidden", !onEditableStep);
    applyBtn.disabled = !onEditableStep;

    this.updateValorVisibility();
    this.updateNavigationButtons();
    this.hideConflicts();

    if (this.currentStep === "emitir") {
      this.setStatus("Revise os dados e emita a NFS-e manualmente no portal.", "info");
    } else if (FacilitaNFSe.isStepReadyToAdvance(this.currentStep)) {
      this.setStatus("Passo com campos preenchidos. Você pode avançar.", "ok");
    } else {
      this.setStatus("", null);
    }

    advanceBtn.classList.toggle("fn-hidden", !this.shouldShowAdvance());
    finishBtn.classList.toggle("fn-hidden", this.currentStep !== "emitir");

    if (this.currentStep === "emitir") {
      finishBtn.disabled = false;
      finishBtn.textContent = "Concluir";
    } else if (this.currentStep === "tributacao") {
      advanceBtn.textContent = "Avançar para revisão";
    } else {
      advanceBtn.textContent = "Avançar";
    }
  },

  shouldShowAdvance: function () {
    return (
      this.currentStep &&
      this.currentStep !== "emitir" &&
      FacilitaNFSe.isStepReadyToAdvance(this.currentStep)
    );
  },

  updateNavigationButtons: function () {
    document.getElementById("fn-advance").classList.toggle("fn-hidden", !this.shouldShowAdvance());
    document.getElementById("fn-finish").classList.toggle("fn-hidden", this.currentStep !== "emitir");
  },

  hideConflicts: function () {
    document.getElementById("fn-conflicts").classList.add("fn-hidden");
    this.pendingApply = null;
  },

  showConflicts: function (scanResult, template, runtime) {
    this.pendingApply = {
      template: template,
      runtime: runtime,
      conflicts: scanResult.conflicts,
    };

    var list = document.getElementById("fn-conflict-list");
    list.innerHTML = "";

    scanResult.conflicts.forEach(function (field) {
      var item = document.createElement("li");
      item.className = "fn-conflict-item";
      item.innerHTML =
        '<label><input type="checkbox" data-conflict-key="' +
        field.key +
        '" />' +
        "<span><strong>" +
        field.label +
        "</strong></span></label>" +
        '<div class="fn-conflict-meta"><span>Atual: ' +
        FacilitaNFSe.Panel.escapeHtml(field.currentDisplay || field.current || "—") +
        "</span><span>Template: " +
        FacilitaNFSe.Panel.escapeHtml(field.proposedDisplay || field.proposed || "—") +
        "</span></div>";
      list.appendChild(item);
    });

    document.getElementById("fn-overwrite-all").checked = false;
    document.getElementById("fn-conflicts").classList.remove("fn-hidden");
    this.setStatus(
      scanResult.conflicts.length +
        " conflito(s) encontrado(s). Escolha o que sobrescrever.",
      "info"
    );
  },

  escapeHtml: function (value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  onOverwriteAllChange: function (event) {
    var checked = event.target.checked;
    document.querySelectorAll("#fn-conflict-list input[type='checkbox']").forEach(function (input) {
      input.checked = checked;
    });
  },

  onApplyClick: function () {
    var template = this.getSelectedTemplate();
    if (!template) {
      this.setStatus("Selecione um template.", "error");
      return;
    }

    var runtime = this.buildRuntime(template);
    if (
      this.currentStep === "tributacao" &&
      template.tributacao &&
      template.tributacao.valorServicoPrompt &&
      !runtime.valorServico
    ) {
      this.setStatus("Informe o valor do serviço.", "error");
      return;
    }

    var scanResult = FacilitaNFSe.scanStep(this.currentStep, template, runtime);
    if (scanResult.conflicts.length) {
      this.showConflicts(scanResult, template, runtime);
      return;
    }

    this.executeApply(template, runtime, { overwriteAll: false, overwriteFields: [] });
  },

  onConfirmConflicts: function () {
    if (!this.pendingApply) return;

    var overwriteAll = document.getElementById("fn-overwrite-all").checked;
    var overwriteFields = [];
    document.querySelectorAll("#fn-conflict-list input[type='checkbox']:checked").forEach(function (input) {
      overwriteFields.push(input.getAttribute("data-conflict-key"));
    });

    var pending = this.pendingApply;
    this.hideConflicts();
    this.executeApply(pending.template, pending.runtime, {
      overwriteAll: overwriteAll,
      overwriteFields: overwriteFields,
    });
  },

  executeApply: function (template, runtime, options) {
    var self = this;
    this.setStatus("Aplicando template...", null);
    document.getElementById("fn-apply").disabled = true;

    FacilitaNFSe.applyTemplateOnPage(template, runtime, options)
      .then(function (result) {
        var scanAfter = FacilitaNFSe.scanStep(self.currentStep, template, runtime);
        var skipped = scanAfter.conflicts.length;
        var message = "Template aplicado.";
        if (skipped) {
          message += " " + skipped + " campo(s) mantidos com valor atual.";
        }
        self.setStatus(message, "ok");
        self.updateNavigationButtons();
      })
      .catch(function (error) {
        self.setStatus(error.message || String(error), "error");
      })
      .finally(function () {
        document.getElementById("fn-apply").disabled = false;
      });
  },

  onAdvanceClick: function () {
    var button = document.getElementById("btnAvancar");
    if (!button) {
      this.setStatus("Botão Avançar não encontrado nesta página.", "error");
      return;
    }
    this.setStatus("Avançando para o próximo passo...", "info");
    button.click();
  },

  onFinishClick: function () {
    this.setStatus(
      "Fluxo assistido concluído. Revise os dados e emita a NFS-e no portal.",
      "ok"
    );
    document.getElementById("fn-finish").disabled = true;
  },
};

FacilitaNFSe.initPanel = function () {
  FacilitaNFSe.Panel.init();
};
