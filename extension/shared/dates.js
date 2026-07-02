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

/**
 * Primeiro dia do mês atual (dd/mm/aaaa).
 */
FacilitaNFSe.getCurrentMonthCompetence = function () {
  var date = new Date();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var year = date.getFullYear();
  return "01/" + month + "/" + year;
};

FacilitaNFSe.resolveCompetence = function (value) {
  if (value === "previousMonth") {
    return FacilitaNFSe.getPreviousMonthCompetence();
  }
  if (value === "currentMonth") {
    return FacilitaNFSe.getCurrentMonthCompetence();
  }
  return value || "";
};
