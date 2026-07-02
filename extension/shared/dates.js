var FacilitaNFSe = self.FacilitaNFSe;

/**
 * Primeiro dia do mês anterior (dd/mm/aaaa) — padrão para competência recorrente.
 */
FacilitaNFSe.getPreviousMonthCompetence = function () {
  var date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var year = date.getFullYear();
  return "01/" + month + "/" + year;
};

FacilitaNFSe.resolveCompetence = function (value) {
  if (value === "previousMonth") {
    return FacilitaNFSe.getPreviousMonthCompetence();
  }
  return value || "";
};
