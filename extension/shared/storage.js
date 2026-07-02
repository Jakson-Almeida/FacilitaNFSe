var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.loadTemplates = function () {
  return new Promise(function (resolve) {
    chrome.storage.local.get(FacilitaNFSe.STORAGE_KEY, function (result) {
      var custom = result[FacilitaNFSe.STORAGE_KEY] || [];
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
      resolve(merged);
    });
  });
};

FacilitaNFSe.getTemplateById = function (id) {
  return FacilitaNFSe.loadTemplates().then(function (templates) {
    return templates.find(function (template) {
      return template.id === id;
    });
  });
};
