var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.Panel = {
  root: null,
  templates: [],
  currentStep: null,
  pendingApply: null,
  selectedTemplateId: null,
  emissionPending: false,
  emissionAutoClicked: false,

  init: function () {
    if (document.getElementById("facilita-nfse-panel")) return;

    var panel = document.createElement("div");
    panel.id = "facilita-nfse-panel";
    panel.innerHTML =
      '<div class="fn-header">' +
      '<div class="fn-header-brand">' +
      '<img id="fn-logo" class="fn-logo" alt="" />' +
      "<strong>FacilitaNFSe</strong>" +
      "</div>" +
      '<div class="fn-header-actions">' +
      '<button type="button" id="fn-toggle" class="fn-header-btn" title="Recolher" aria-label="Recolher">−</button>' +
      '<button type="button" id="fn-close" class="fn-header-btn" title="Fechar" aria-label="Fechar">×</button>' +
      "</div>" +
      "</div>" +
      '<div class="fn-body">' +
      '<p class="fn-step" id="fn-step-label">Detectando passo...</p>' +
      '<div id="fn-main-controls">' +
      "<label for=\"fn-template\">Template</label>" +
      '<div class="fn-template-row">' +
      '<select id="fn-template"></select>' +
      '<div class="fn-template-menu-wrap">' +
      '<button type="button" id="fn-template-settings" class="fn-icon-btn" title="Opções do template" aria-label="Opções do template" aria-expanded="false" aria-haspopup="true">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M19.14 12.936a7.07 7.07 0 0 0 .053-.936 7.07 7.07 0 0 0-.053-.936l2.029-1.587a.5.5 0 0 0 .121-.637l-1.92-3.324a.5.5 0 0 0-.606-.22l-2.39.962a7.12 7.12 0 0 0-1.62-.936l-.361-2.538a.5.5 0 0 0-.497-.425h-3.84a.5.5 0 0 0-.497.425l-.361 2.538a7.12 7.12 0 0 0-1.62.936l-2.39-.962a.5.5 0 0 0-.606.22L2.657 8.44a.5.5 0 0 0 .121.637l2.029 1.587a7.07 7.07 0 0 0-.053.936 7.07 7.07 0 0 0 .053.936l-2.029 1.587a.5.5 0 0 0-.121.637l1.92 3.324a.5.5 0 0 0 .606.22l2.39-.962c.502.386 1.04.708 1.62.936l.361 2.538a.5.5 0 0 0 .497.425h3.84a.5.5 0 0 0 .497-.425l.361-2.538c.58-.228 1.118-.55 1.62-.936l2.39.962a.5.5 0 0 0 .606-.22l1.92-3.324a.5.5 0 0 0-.121-.637l-2.029-1.587ZM12 15.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4Z"/>' +
      "</svg>" +
      "</button>" +
      '<div id="fn-template-actions" class="fn-template-menu fn-hidden" role="menu">' +
      '<button type="button" class="fn-menu-item" id="fn-new-template" role="menuitem">Novo template</button>' +
      '<button type="button" class="fn-menu-item" id="fn-edit-template" role="menuitem">Editar</button>' +
      '<button type="button" class="fn-menu-item" id="fn-duplicate-template" role="menuitem">Duplicar</button>' +
      "</div>" +
      "</div>" +
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
      '<div id="fn-emit-confirm" class="fn-confirm fn-hidden">' +
      "<h3>Confirmar emissão</h3>" +
      '<p class="fn-summary">Tem certeza que deseja emitir a NFS-e? Revise os dados antes de confirmar.</p>' +
      '<div class="fn-actions-row">' +
      '<button type="button" class="fn-btn fn-btn-secondary" id="fn-cancel-emit">Cancelar</button>' +
      '<button type="button" class="fn-btn fn-btn-primary" id="fn-confirm-emit">Sim, emitir NFS-e</button>' +
      "</div>" +
      "</div>" +
      '<div id="fn-emit-success" class="fn-emit-success fn-hidden">' +
      "<p><strong>NFS-e emitida com sucesso!</strong></p>" +
      '<p class="fn-summary">A emissão foi concluída. Confira os dados na página do portal.</p>' +
      "</div>" +
      '<button type="button" class="fn-btn fn-btn-success fn-hidden" id="fn-advance">Avançar</button>' +
      '<button type="button" class="fn-btn fn-btn-success fn-hidden" id="fn-finish">Emitir NFS-e</button>' +
      "</div>";

    document.body.appendChild(panel);
    this.root = panel;

    document.getElementById("fn-logo").src = chrome.runtime.getURL("icons/icon16.png");
    document.getElementById("fn-toggle").addEventListener("click", this.toggleCollapsed.bind(this));
    document.getElementById("fn-close").addEventListener("click", this.closePanel.bind(this));
    document.getElementById("fn-template-settings").addEventListener("click", this.toggleTemplateMenu.bind(this));
    if (!this.boundDocumentClick) {
      this.boundDocumentClick = this.onDocumentClick.bind(this);
      document.addEventListener("click", this.boundDocumentClick);
    }
    document.getElementById("fn-apply").addEventListener("click", this.onApplyClick.bind(this));
    document.getElementById("fn-cancel-conflicts").addEventListener("click", this.hideConflicts.bind(this));
    document.getElementById("fn-confirm-conflicts").addEventListener("click", this.onConfirmConflicts.bind(this));
    document.getElementById("fn-overwrite-all").addEventListener("change", this.onOverwriteAllChange.bind(this));
    document.getElementById("fn-advance").addEventListener("click", this.onAdvanceClick.bind(this));
    document.getElementById("fn-finish").addEventListener("click", this.onFinishClick.bind(this));
    document.getElementById("fn-cancel-emit").addEventListener("click", this.hideEmitConfirm.bind(this));
    document.getElementById("fn-confirm-emit").addEventListener("click", this.onConfirmEmit.bind(this));
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
        if (sessionStorage.getItem("facilita-nfse-emission-pending") === "1") {
          FacilitaNFSe.Panel.resumeEmissionWatch();
        }
      }
    );
  },

  toggleCollapsed: function () {
    this.root.classList.toggle("fn-collapsed");
    var toggle = document.getElementById("fn-toggle");
    toggle.textContent = this.root.classList.contains("fn-collapsed") ? "+" : "−";
  },

  closePanel: function () {
    this.hideTemplateMenu();
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  },

  toggleTemplateMenu: function (event) {
    if (event) {
      event.stopPropagation();
    }
    var menu = document.getElementById("fn-template-actions");
    var button = document.getElementById("fn-template-settings");
    var willOpen = menu.classList.contains("fn-hidden");
    menu.classList.toggle("fn-hidden", !willOpen);
    button.classList.toggle("fn-active", willOpen);
    button.setAttribute("aria-expanded", willOpen ? "true" : "false");
  },

  hideTemplateMenu: function () {
    var menu = document.getElementById("fn-template-actions");
    var button = document.getElementById("fn-template-settings");
    if (!menu || !button) return;
    menu.classList.add("fn-hidden");
    button.classList.remove("fn-active");
    button.setAttribute("aria-expanded", "false");
  },

  onDocumentClick: function (event) {
    if (!this.root) return;
    if (!event.target.closest("#facilita-nfse-panel .fn-template-menu-wrap")) {
      this.hideTemplateMenu();
    }
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
    this.hideTemplateMenu();
    var template = this.getSelectedTemplate();
    if (!template) {
      this.setStatus("Selecione um template para duplicar.", "error");
      return;
    }
    FacilitaNFSe.TemplateEditor.openDuplicate(template);
  },

  onNewTemplate: function () {
    this.hideTemplateMenu();
    FacilitaNFSe.TemplateEditor.openNew();
  },

  onEditTemplate: function () {
    this.hideTemplateMenu();
    var template = this.getSelectedTemplate();
    if (!template) {
      this.setStatus("Selecione um template para editar.", "error");
      return;
    }
    FacilitaNFSe.TemplateEditor.openEdit(template);
  },

  onTemplateChange: function () {
    this.hideTemplateMenu();
    this.selectedTemplateId = document.getElementById("fn-template").value;
    this.updateValorVisibility();
    this.hideConflicts();
  },

  refresh: function () {
    if (document.getElementById("fn-editor") && !document.getElementById("fn-editor").classList.contains("fn-hidden")) {
      return;
    }

    this.currentStep = FacilitaNFSe.detectStep(window.location.pathname);

    if (
      sessionStorage.getItem("facilita-nfse-emission-pending") === "1" &&
      !this.emissionPending &&
      !FacilitaNFSe.detectNfseSuccess()
    ) {
      this.resumeEmissionWatch();
      return;
    }

    if (this.currentStep === "pessoas") {
      sessionStorage.removeItem("facilita-nfse-emission-done");
      sessionStorage.removeItem("facilita-nfse-emission-pending");
      this.emissionPending = false;
      this.emissionAutoClicked = false;
    }

    if (
      sessionStorage.getItem("facilita-nfse-emission-done") === "1" ||
      FacilitaNFSe.detectNfseSuccess()
    ) {
      this.showEmissionSuccess();
      return;
    }

    var stepLabel = document.getElementById("fn-step-label");
    var applyBtn = document.getElementById("fn-apply");
    var mainControls = document.getElementById("fn-main-controls");
    var advanceBtn = document.getElementById("fn-advance");
    var finishBtn = document.getElementById("fn-finish");

    stepLabel.textContent =
      FacilitaNFSe.STEP_LABELS[this.currentStep] || "Fora do fluxo DPS";

    var onEditableStep =
      this.currentStep &&
      this.currentStep !== "emitir" &&
      this.currentStep !== "nfse";
    mainControls.classList.toggle("fn-hidden", !onEditableStep);
    applyBtn.disabled = !onEditableStep;

    this.updateValorVisibility();
    this.updateNavigationButtons();
    this.hideConflicts();
    this.hideEmitConfirm();

    if (this.emissionPending) {
      this.setStatus("Emitindo NFS-e...", "info");
      finishBtn.classList.add("fn-hidden");
      finishBtn.disabled = true;
      return;
    }

    if (this.currentStep === "emitir") {
      this.setStatus("Revise os dados e confirme a emissão da NFS-e.", "info");
    } else if (this.currentStep === "nfse") {
      this.setStatus("Processando emissão da NFS-e...", "info");
    } else if (FacilitaNFSe.isStepReadyToAdvance(this.currentStep)) {
      this.setStatus("Passo com campos preenchidos. Você pode avançar.", "ok");
    } else {
      this.setStatus("", null);
    }

    advanceBtn.classList.toggle("fn-hidden", !this.shouldShowAdvance());
    finishBtn.classList.toggle("fn-hidden", !this.shouldShowFinish());
    finishBtn.disabled = false;

    if (this.currentStep === "emitir") {
      finishBtn.textContent = "Emitir NFS-e";
    } else if (this.currentStep === "tributacao") {
      advanceBtn.textContent = "Avançar para revisão";
    } else {
      advanceBtn.textContent = "Avançar";
    }
  },

  shouldShowFinish: function () {
    return this.currentStep === "emitir" && !this.emissionPending;
  },

  shouldShowAdvance: function () {
    return (
      this.currentStep &&
      this.currentStep !== "emitir" &&
      this.currentStep !== "nfse" &&
      FacilitaNFSe.isStepReadyToAdvance(this.currentStep)
    );
  },

  updateNavigationButtons: function () {
    document.getElementById("fn-advance").classList.toggle("fn-hidden", !this.shouldShowAdvance());
    document.getElementById("fn-finish").classList.toggle("fn-hidden", !this.shouldShowFinish());
  },

  hideEmitConfirm: function () {
    document.getElementById("fn-emit-confirm").classList.add("fn-hidden");
    if (this.shouldShowFinish()) {
      document.getElementById("fn-finish").classList.remove("fn-hidden");
    }
  },

  showEmitConfirm: function () {
    document.getElementById("fn-finish").classList.add("fn-hidden");
    document.getElementById("fn-emit-confirm").classList.remove("fn-hidden");
    this.setStatus("Confirme se deseja emitir a NFS-e.", "info");
  },

  showEmissionSuccess: function () {
    this.emissionPending = false;
    this.emissionAutoClicked = false;
    sessionStorage.removeItem("facilita-nfse-emission-pending");
    sessionStorage.setItem("facilita-nfse-emission-done", "1");

    document.getElementById("fn-main-controls").classList.add("fn-hidden");
    document.getElementById("fn-advance").classList.add("fn-hidden");
    document.getElementById("fn-finish").classList.add("fn-hidden");
    document.getElementById("fn-emit-confirm").classList.add("fn-hidden");
    document.getElementById("fn-emit-success").classList.remove("fn-hidden");
    document.getElementById("fn-step-label").textContent = "NFS-e emitida";
    this.setStatus("NFS-e emitida com sucesso!", "ok");
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
    if (!FacilitaNFSe.clickAdvanceButton()) {
      this.setStatus("Botão Avançar não encontrado nesta página.", "error");
      return;
    }
    this.setStatus("Avançando para o próximo passo...", "info");
  },

  onFinishClick: function () {
    if (this.currentStep !== "emitir") return;
    this.showEmitConfirm();
  },

  onConfirmEmit: function () {
    var self = this;
    document.getElementById("fn-confirm-emit").disabled = true;

    if (!FacilitaNFSe.clickEmitNfseButton()) {
      document.getElementById("fn-confirm-emit").disabled = false;
      this.hideEmitConfirm();
      this.setStatus("Botão Emitir NFS-e não encontrado nesta página.", "error");
      return;
    }

    this.emissionPending = true;
    this.emissionAutoClicked = false;
    sessionStorage.setItem("facilita-nfse-emission-pending", "1");
    document.getElementById("fn-emit-confirm").classList.add("fn-hidden");
    this.setStatus("Emitindo NFS-e...", "info");
    document.getElementById("fn-finish").classList.add("fn-hidden");

    this.startEmissionWatch().finally(function () {
      document.getElementById("fn-confirm-emit").disabled = false;
    });
  },

  startEmissionWatch: function () {
    var self = this;
    return FacilitaNFSe.waitForNfseSuccess(90000, function () {
      if (self.emissionAutoClicked) return;
      if (FacilitaNFSe.detectStep(window.location.pathname) !== "nfse") return;
      if (FacilitaNFSe.clickEmitNfseButton()) {
        self.emissionAutoClicked = true;
      }
    })
      .then(function () {
        self.showEmissionSuccess();
      })
      .catch(function (error) {
        self.emissionPending = false;
        sessionStorage.removeItem("facilita-nfse-emission-pending");
        self.refresh();
        self.setStatus(error.message || String(error), "error");
      });
  },

  resumeEmissionWatch: function () {
    this.emissionPending = true;
    document.getElementById("fn-finish").classList.add("fn-hidden");
    document.getElementById("fn-emit-confirm").classList.add("fn-hidden");
    this.setStatus("Emitindo NFS-e...", "info");
    this.startEmissionWatch();
  },
};

FacilitaNFSe.initPanel = function () {
  FacilitaNFSe.Panel.init();
};
