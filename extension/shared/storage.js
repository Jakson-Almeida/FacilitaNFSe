var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.loadCustomTemplates = function () {
  return new Promise(function (resolve) {
    chrome.storage.local.get(FacilitaNFSe.STORAGE_KEY, function (result) {
      resolve(result[FacilitaNFSe.STORAGE_KEY] || []);
    });
  });
};

FacilitaNFSe.loadTemplates = function () {
  return FacilitaNFSe.loadCustomTemplates().then(function (custom) {
    var merged = FacilitaNFSe.DEFAULT_TEMPLATES.slice();
    custom.forEach(function (template) {
      var index = merged.findIndex(function (item) {
        return item.id === template.id;
      });
      if (index >= 0) {
        merged[index] = template;
      } else {
        merged.push(template);
      }
    });
    return merged;
  });
};

FacilitaNFSe.getTemplateById = function (id) {
  return FacilitaNFSe.loadTemplates().then(function (templates) {
    return templates.find(function (template) {
      return template.id === id;
    });
  });
};

FacilitaNFSe.saveCustomTemplate = function (template) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(FacilitaNFSe.STORAGE_KEY, function (result) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      var custom = result[FacilitaNFSe.STORAGE_KEY] || [];
      var index = custom.findIndex(function (item) {
        return item.id === template.id;
      });

      if (index >= 0) {
        custom[index] = template;
      } else {
        custom.push(template);
      }

      var payload = {};
      payload[FacilitaNFSe.STORAGE_KEY] = custom;
      chrome.storage.local.set(payload, function () {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(template);
      });
    });
  });
};

FacilitaNFSe.deleteCustomTemplate = function (id) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(FacilitaNFSe.STORAGE_KEY, function (result) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      var custom = (result[FacilitaNFSe.STORAGE_KEY] || []).filter(function (template) {
        return template.id !== id;
      });

      var payload = {};
      payload[FacilitaNFSe.STORAGE_KEY] = custom;
      chrome.storage.local.set(payload, function () {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(true);
      });
    });
  });
};

FacilitaNFSe.isTemplateCustomized = function (id) {
  return FacilitaNFSe.loadCustomTemplates().then(function (custom) {
    return custom.some(function (template) {
      return template.id === id;
    });
  });
};
