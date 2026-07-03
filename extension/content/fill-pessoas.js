var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.waitForFieldValue = function (id, timeoutMs) {
  var started = Date.now();
  return new Promise(function (resolve, reject) {
    function poll() {
      var element = document.getElementById(id);
      if (element && element.value && element.value.trim()) {
        resolve(element.value.trim());
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("Timeout aguardando campo: " + id));
        return;
      }
      setTimeout(poll, 200);
    }
    poll();
  });
};

FacilitaNFSe.fillPessoas = function (config, runtime, options) {
  if (!config) return Promise.resolve({ ok: true, skipped: true });
  options = options || {};
  runtime = runtime || {};

  if (runtime.tomadorInscricao && config.tomador) {
    config = FacilitaNFSe.cloneTemplate({ pessoas: config }).pessoas;
    config.tomador.inscricao = runtime.tomadorInscricao;
  }

  var chain = Promise.resolve();

  if (config.dataCompetencia) {
    var competence = FacilitaNFSe.resolveCompetence(config.dataCompetencia);
    chain = chain.then(function () {
      if (
        !FacilitaNFSe.shouldApplyField(
          "competence",
          FacilitaNFSe.getInputValue("DataCompetencia"),
          competence,
          options
        )
      ) {
        return null;
      }
      return FacilitaNFSe.setCompetenceDate(competence);
    });
  }

  if (config.tomador) {
    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "tomadorLocal",
          FacilitaNFSe.getRadioValue("Tomador.LocalDomicilio"),
          config.tomador.localDomicilio,
          options
        )
      ) {
        FacilitaNFSe.clickRadio("Tomador.LocalDomicilio", config.tomador.localDomicilio);
      }
      return FacilitaNFSe.sleep(400);
    });

    if (config.tomador.inscricao) {
      chain = chain.then(function () {
        if (
          FacilitaNFSe.shouldApplyField(
            "tomadorInscricao",
            FacilitaNFSe.getInputValue("Tomador_Inscricao"),
            config.tomador.inscricao,
            options
          )
        ) {
          FacilitaNFSe.setInputById("Tomador_Inscricao", config.tomador.inscricao);
        }
        return FacilitaNFSe.sleep(200);
      });
    }

    if (config.tomador.buscarInscricao) {
      chain = chain.then(function () {
        var hasNome = !!FacilitaNFSe.getInputValue("Tomador_Nome");
        var willChangeInscricao = FacilitaNFSe.shouldApplyField(
          "tomadorInscricao",
          FacilitaNFSe.getInputValue("Tomador_Inscricao"),
          config.tomador.inscricao,
          options
        );
        if (hasNome && !willChangeInscricao) return null;

        return FacilitaNFSe.dismissVisibleModal().then(function () {
          FacilitaNFSe.clickButton("btn_Tomador_Inscricao_pesquisar");
          return FacilitaNFSe.waitForFieldValue("Tomador_Nome", 10000).catch(function () {
            return null;
          });
        });
      });
    }

    if (config.tomador.nome) {
      chain = chain.then(function () {
        if (
          FacilitaNFSe.shouldApplyField(
            "tomadorNome",
            FacilitaNFSe.getInputValue("Tomador_Nome"),
            config.tomador.nome,
            options
          )
        ) {
          FacilitaNFSe.setInputById("Tomador_Nome", config.tomador.nome);
        }
        return FacilitaNFSe.sleep(200);
      });
    }

    if (config.tomador.informarEndereco && config.tomador.enderecoNacional) {
      chain = chain.then(function () {
        var endereco = config.tomador.enderecoNacional;
        var needsEndereco = [
          ["tomadorCep", "Tomador_EnderecoNacional_CEP", endereco.cep],
          ["tomadorLogradouro", "Tomador_EnderecoNacional_Logradouro", endereco.logradouro],
          ["tomadorNumero", "Tomador_EnderecoNacional_Numero", endereco.numero],
          ["tomadorBairro", "Tomador_EnderecoNacional_Bairro", endereco.bairro],
        ].some(function (item) {
          return (
            item[2] &&
            FacilitaNFSe.shouldApplyField(
              item[0],
              FacilitaNFSe.getInputValue(item[1]),
              item[2],
              options
            )
          );
        });

        if (needsEndereco) {
          FacilitaNFSe.setCheckbox("Tomador_InformarEndereco", true);
        }
        return FacilitaNFSe.sleep(300);
      });

      var endereco = config.tomador.enderecoNacional;
      var enderecoFields = [
        ["tomadorCep", "Tomador_EnderecoNacional_CEP", endereco.cep],
        ["tomadorLogradouro", "Tomador_EnderecoNacional_Logradouro", endereco.logradouro],
        ["tomadorNumero", "Tomador_EnderecoNacional_Numero", endereco.numero],
        ["tomadorComplemento", "Tomador_EnderecoNacional_Complemento", endereco.complemento],
        ["tomadorBairro", "Tomador_EnderecoNacional_Bairro", endereco.bairro],
      ];

      enderecoFields.forEach(function (pair) {
        var fieldKey = pair[0];
        var fieldId = pair[1];
        var value = pair[2];
        if (!value) return;
        chain = chain.then(function () {
          if (
            FacilitaNFSe.shouldApplyField(
              fieldKey,
              FacilitaNFSe.getInputValue(fieldId),
              value,
              options
            )
          ) {
            FacilitaNFSe.setInputById(fieldId, value);
          }
          return FacilitaNFSe.sleep(150);
        });
      });
    }
  }

  if (config.intermediario) {
    chain = chain.then(function () {
      if (
        FacilitaNFSe.shouldApplyField(
          "intermediarioLocal",
          FacilitaNFSe.getRadioValue("Intermediario.LocalDomicilio"),
          config.intermediario.localDomicilio,
          options
        )
      ) {
        FacilitaNFSe.clickRadio(
          "Intermediario.LocalDomicilio",
          config.intermediario.localDomicilio
        );
      }
      return FacilitaNFSe.sleep(200);
    });
  }

  return chain.then(function () {
    return { ok: true, step: "pessoas" };
  });
};
