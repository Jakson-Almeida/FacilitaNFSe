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

FacilitaNFSe.fillPessoas = function (config) {
  if (!config) return Promise.resolve({ ok: true, skipped: true });

  var chain = Promise.resolve();

  if (config.dataCompetencia) {
    var competence = FacilitaNFSe.resolveCompetence(config.dataCompetencia);
    chain = chain.then(function () {
      FacilitaNFSe.setInputById("DataCompetencia", competence);
      return FacilitaNFSe.sleep(200);
    });
  }

  if (config.tomador) {
    chain = chain.then(function () {
      FacilitaNFSe.clickRadio("Tomador.LocalDomicilio", config.tomador.localDomicilio);
      return FacilitaNFSe.sleep(400);
    });

    if (config.tomador.inscricao) {
      chain = chain.then(function () {
        FacilitaNFSe.setInputById("Tomador_Inscricao", config.tomador.inscricao);
        return FacilitaNFSe.sleep(200);
      });
    }

    if (config.tomador.buscarInscricao) {
      chain = chain.then(function () {
        FacilitaNFSe.clickButton("btn_Tomador_Inscricao_pesquisar");
        return FacilitaNFSe.waitForFieldValue("Tomador_Nome", 10000).catch(function () {
          return null;
        });
      });
    }

    if (config.tomador.nome) {
      chain = chain.then(function () {
        var nomeField = document.getElementById("Tomador_Nome");
        if (nomeField && !nomeField.value.trim()) {
          FacilitaNFSe.setInputById("Tomador_Nome", config.tomador.nome);
        }
        return FacilitaNFSe.sleep(200);
      });
    }

    if (config.tomador.informarEndereco && config.tomador.enderecoNacional) {
      chain = chain.then(function () {
        FacilitaNFSe.setCheckbox("Tomador_InformarEndereco", true);
        return FacilitaNFSe.sleep(300);
      });

      var endereco = config.tomador.enderecoNacional;
      var enderecoFields = [
        ["Tomador_EnderecoNacional_CEP", endereco.cep],
        ["Tomador_EnderecoNacional_Logradouro", endereco.logradouro],
        ["Tomador_EnderecoNacional_Numero", endereco.numero],
        ["Tomador_EnderecoNacional_Complemento", endereco.complemento],
        ["Tomador_EnderecoNacional_Bairro", endereco.bairro],
      ];

      enderecoFields.forEach(function (pair) {
        var fieldId = pair[0];
        var value = pair[1];
        if (!value) return;
        chain = chain.then(function () {
          var field = document.getElementById(fieldId);
          if (field && !field.value.trim()) {
            FacilitaNFSe.setInputById(fieldId, value);
          }
          return FacilitaNFSe.sleep(150);
        });
      });
    }
  }

  if (config.intermediario) {
    chain = chain.then(function () {
      FacilitaNFSe.clickRadio(
        "Intermediario.LocalDomicilio",
        config.intermediario.localDomicilio
      );
      return FacilitaNFSe.sleep(200);
    });
  }

  return chain.then(function () {
    return { ok: true, step: "pessoas" };
  });
};
