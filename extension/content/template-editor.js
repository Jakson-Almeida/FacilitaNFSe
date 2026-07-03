var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.TemplateEditor = {
  originalId: null,
  draft: null,

  openNew: function () {
    this.originalId = null;
    this.draft = FacilitaNFSe.createEmptyTemplate();
    this.show();
  },

  openEdit: function (template) {
    this.originalId = template.id;
    this.draft = FacilitaNFSe.cloneTemplate(template);
    this.show();
  },

  openDuplicate: function (template) {
    this.originalId = null;
    this.draft = FacilitaNFSe.cloneTemplate(template);
    this.draft.id = "";
    this.draft.name = template.name + " (cópia)";
    this.show();
  },

  show: function () {
    document.getElementById("fn-main-controls").classList.add("fn-hidden");
    FacilitaNFSe.Panel.hideTemplateMenu();
    document.getElementById("fn-conflicts").classList.add("fn-hidden");
    document.getElementById("fn-emit-confirm").classList.add("fn-hidden");
    document.getElementById("fn-emit-success").classList.add("fn-hidden");
    document.getElementById("fn-advance").classList.add("fn-hidden");
    document.getElementById("fn-finish").classList.add("fn-hidden");
    document.getElementById("fn-editor").classList.remove("fn-hidden");
    this.root.classList.add("fn-editor-open");

    var title = this.originalId ? "Editar template" : "Novo template";
    document.getElementById("fn-editor-title").textContent = title;

    var deleteBtn = document.getElementById("fn-editor-delete");
    var canDelete = this.originalId && !FacilitaNFSe.isBuiltinTemplateId(this.originalId);
    var canReset = this.originalId && FacilitaNFSe.isBuiltinTemplateId(this.originalId);
    deleteBtn.classList.toggle("fn-hidden", !canDelete && !canReset);
    deleteBtn.textContent = canReset ? "Restaurar padrão" : "Excluir";

    this.renderForm(this.draft);
  },

  close: function () {
    document.getElementById("fn-editor").classList.add("fn-hidden");
    document.getElementById("fn-main-controls").classList.remove("fn-hidden");
    FacilitaNFSe.Panel.hideTemplateMenu();
    this.root.classList.remove("fn-editor-open");
    FacilitaNFSe.Panel.refresh();
  },

  get root() {
    return document.getElementById("facilita-nfse-panel");
  },

  field: function (label, html) {
    return (
      '<div class="fn-field">' +
      "<label>" +
      label +
      "</label>" +
      html +
      "</div>"
    );
  },

  input: function (path, value, placeholder) {
    return (
      '<input type="text" data-path="' +
      path +
      '" value="' +
      FacilitaNFSe.Panel.escapeHtml(value || "") +
      '" placeholder="' +
      FacilitaNFSe.Panel.escapeHtml(placeholder || "") +
      '" />'
    );
  },

  textarea: function (path, value, rows) {
    return (
      '<textarea data-path="' +
      path +
      '" rows="' +
      (rows || 3) +
      '">' +
      FacilitaNFSe.Panel.escapeHtml(value || "") +
      "</textarea>"
    );
  },

  select: function (path, value, options) {
    var html = '<select data-path="' + path + '">';
    options.forEach(function (option) {
      html +=
        '<option value="' +
        FacilitaNFSe.Panel.escapeHtml(option.value) +
        '"' +
        (String(value) === String(option.value) ? " selected" : "") +
        ">" +
        FacilitaNFSe.Panel.escapeHtml(option.label) +
        "</option>";
    });
    html += "</select>";
    return html;
  },

  checkbox: function (path, checked, label) {
    return (
      '<label class="fn-check"><input type="checkbox" data-path="' +
      path +
      '"' +
      (checked ? " checked" : "") +
      " /> " +
      label +
      "</label>"
    );
  },

  renderForm: function (template) {
    var tomador = (template.pessoas && template.pessoas.tomador) || {};
    var endereco = tomador.enderecoNacional || {};
    var servico = template.servico || {};
    var tributacao = template.tributacao || {};
    var form = document.getElementById("fn-editor-form");

    form.innerHTML =
      '<fieldset class="fn-fieldset"><legend>Geral</legend>' +
      this.field("Nome", this.input("name", template.name, "Ex.: Cliente X — Serviço Y")) +
      this.field(
        "ID interno",
        this.input("id", template.id, "Gerado automaticamente ao salvar")
      ) +
      "</fieldset>" +
      '<fieldset class="fn-fieldset"><legend>Passo 1 — Pessoas</legend>' +
      this.field(
        "Data de competência",
        this.select("pessoas.dataCompetencia", template.pessoas && template.pessoas.dataCompetencia, [
          { value: "currentMonth", label: "1º dia do mês atual" },
          { value: "previousMonth", label: "1º dia do mês anterior" },
          { value: "__custom__", label: "Data fixa (dd/mm/aaaa)" },
        ]) +
          '<input type="text" class="fn-custom-date fn-hidden" data-custom-for="pessoas.dataCompetencia" placeholder="01/07/2026" />'
      ) +
      this.field(
        "Tomador — localização",
        this.select("pessoas.tomador.localDomicilio", tomador.localDomicilio, [
          { value: "0", label: "Não informado" },
          { value: "1", label: "Brasil" },
          { value: "2", label: "Exterior" },
        ])
      ) +
      this.field(
        "",
        this.checkbox(
          "pessoas.tomador.inscricaoPrompt",
          !!tomador.inscricaoPrompt,
          "Pedir CPF/CNPJ do tomador na hora"
        )
      ) +
      this.field("Tomador — CPF/CNPJ", this.input("pessoas.tomador.inscricao", tomador.inscricao)) +
      this.field("Tomador — Nome/Razão Social", this.input("pessoas.tomador.nome", tomador.nome)) +
      this.field(
        "",
        this.checkbox("pessoas.tomador.buscarInscricao", !!tomador.buscarInscricao, "Buscar CPF/CNPJ automaticamente")
      ) +
      this.field(
        "",
        this.checkbox("pessoas.tomador.informarEndereco", !!tomador.informarEndereco, "Informar endereço manualmente")
      ) +
      this.field("CEP", this.input("pessoas.tomador.enderecoNacional.cep", endereco.cep)) +
      this.field("Logradouro", this.input("pessoas.tomador.enderecoNacional.logradouro", endereco.logradouro)) +
      this.field("Número", this.input("pessoas.tomador.enderecoNacional.numero", endereco.numero)) +
      this.field("Complemento", this.input("pessoas.tomador.enderecoNacional.complemento", endereco.complemento)) +
      this.field("Bairro", this.input("pessoas.tomador.enderecoNacional.bairro", endereco.bairro)) +
      this.field(
        "Intermediário — localização",
        this.select(
          "pessoas.intermediario.localDomicilio",
          template.pessoas && template.pessoas.intermediario && template.pessoas.intermediario.localDomicilio,
          [
            { value: "0", label: "Não informado" },
            { value: "1", label: "Brasil" },
            { value: "2", label: "Exterior" },
          ]
        )
      ) +
      "</fieldset>" +
      '<fieldset class="fn-fieldset"><legend>Passo 2 — Serviço</legend>' +
      this.field("País da prestação", this.input("servico.codigoPaisPrestacao", servico.codigoPaisPrestacao, "BR")) +
      this.field(
        "Município IBGE (opcional)",
        this.input("servico.codigoMunicipioPrestacao", servico.codigoMunicipioPrestacao, "Vazio = município do emitente")
      ) +
      this.field(
        "Código tributação nacional *",
        this.input("servico.codigoTributacaoNacional", servico.codigoTributacaoNacional, "17.06.01")
      ) +
      this.field(
        "Termo de busca Select2",
        this.input("servico.codigoTributacaoBusca", servico.codigoTributacaoBusca, "1706 (mín. 3 caracteres)")
      ) +
      this.field(
        "Imunidade/exportação ISSQN",
        this.select("servico.haExportacaoImunidadeNaoIncidencia", servico.haExportacaoImunidadeNaoIncidencia, [
          { value: "0", label: "Não" },
          { value: "1", label: "Sim" },
        ])
      ) +
      this.field("Descrição do serviço *", this.textarea("servico.descricao", servico.descricao, 4)) +
      "</fieldset>" +
      '<fieldset class="fn-fieldset"><legend>Passo 3 — Valores</legend>' +
      this.field(
        "",
        this.checkbox("tributacao.valorServicoPrompt", tributacao.valorServicoPrompt !== false, "Pedir valor do serviço na hora")
      ) +
      this.field(
        "Valor fixo (se não pedir na hora)",
        this.input("tributacao.valorServico", tributacao.valorServico, "150,00")
      ) +
      this.field(
        "Tributos estimados",
        this.select("tributacao.tipoValorTributos", tributacao.tipoValorTributos, [
          { value: "1", label: "Valores monetários" },
          { value: "2", label: "Percentuais" },
          { value: "3", label: "Não informar estimados" },
          { value: "4", label: "Alíquota Simples Nacional" },
        ])
      ) +
      "</fieldset>";

    this.syncCustomDateField(form, template);
    this.bindFormEvents(form);
  },

  syncCustomDateField: function (form, template) {
    var competence = template.pessoas && template.pessoas.dataCompetencia;
    var select = form.querySelector('[data-path="pessoas.dataCompetencia"]');
    var customInput = form.querySelector('[data-custom-for="pessoas.dataCompetencia"]');
    if (!select || !customInput) return;

    if (competence !== "currentMonth" && competence !== "previousMonth" && competence) {
      select.value = "__custom__";
      customInput.value = competence;
      customInput.classList.remove("fn-hidden");
    }
  },

  bindFormEvents: function (form) {
    var competenceSelect = form.querySelector('[data-path="pessoas.dataCompetencia"]');
    var customInput = form.querySelector('[data-custom-for="pessoas.dataCompetencia"]');
    if (competenceSelect && customInput) {
      competenceSelect.addEventListener("change", function () {
        customInput.classList.toggle("fn-hidden", competenceSelect.value !== "__custom__");
      });
    }
  },

  readForm: function () {
    var form = document.getElementById("fn-editor-form");
    var template = FacilitaNFSe.cloneTemplate(this.draft);

    form.querySelectorAll("[data-path]").forEach(function (element) {
      var path = element.getAttribute("data-path");
      var value;

      if (element.type === "checkbox") {
        value = element.checked;
      } else {
        value = element.value;
      }

      FacilitaNFSe.setNestedValue(template, path, value);
    });

    var competenceSelect = form.querySelector('[data-path="pessoas.dataCompetencia"]');
    var customInput = form.querySelector('[data-custom-for="pessoas.dataCompetencia"]');
    if (competenceSelect && competenceSelect.value === "__custom__" && customInput) {
      template.pessoas.dataCompetencia = customInput.value.trim();
    }

    if (!template.pessoas.tomador || template.pessoas.tomador.localDomicilio === "0") {
      delete template.pessoas.tomador;
    }

    return FacilitaNFSe.sanitizeTemplate(template);
  },

  save: function () {
    var self = this;
    var template = this.readForm();
    var existingIds = FacilitaNFSe.Panel.templates.map(function (item) {
      return item.id;
    });

    if (!template.id) {
      template.id = FacilitaNFSe.slugifyTemplateId(template.name, existingIds);
    }

    var errors = FacilitaNFSe.validateTemplate(template, existingIds, this.originalId);
    if (errors.length) {
      FacilitaNFSe.Panel.setStatus(errors[0], "error");
      return;
    }

    if (this.originalId && this.originalId !== template.id) {
      FacilitaNFSe.deleteCustomTemplate(this.originalId).then(function () {
        return FacilitaNFSe.saveCustomTemplate(template);
      }).then(function () {
        return self.afterSave(template);
      }).catch(function (error) {
        FacilitaNFSe.Panel.setStatus(error.message, "error");
      });
      return;
    }

    FacilitaNFSe.saveCustomTemplate(template)
      .then(function () {
        return self.afterSave(template);
      })
      .catch(function (error) {
        FacilitaNFSe.Panel.setStatus(error.message, "error");
      });
  },

  afterSave: function (template) {
    var self = this;
    return FacilitaNFSe.loadTemplates().then(function (templates) {
      FacilitaNFSe.Panel.templates = templates;
      FacilitaNFSe.Panel.persistSelectedTemplateId(template.id);
      FacilitaNFSe.Panel.renderTemplates();
      self.close();
      FacilitaNFSe.Panel.setStatus('Template "' + template.name + '" salvo.', "ok");
    });
  },

  remove: function () {
    var self = this;
    if (!this.originalId) return;

    var message = FacilitaNFSe.isBuiltinTemplateId(this.originalId)
      ? "Restaurar template padrão?"
      : "Excluir este template?";

    if (!window.confirm(message)) return;

    FacilitaNFSe.deleteCustomTemplate(this.originalId)
      .then(function () {
        return FacilitaNFSe.loadTemplates();
      })
      .then(function (templates) {
        FacilitaNFSe.Panel.templates = templates;
        FacilitaNFSe.Panel.persistSelectedTemplateId(templates[0] ? templates[0].id : null);
        FacilitaNFSe.Panel.renderTemplates();
        self.close();
        FacilitaNFSe.Panel.setStatus("Template removido.", "ok");
      })
      .catch(function (error) {
        FacilitaNFSe.Panel.setStatus(error.message, "error");
      });
  },
};
