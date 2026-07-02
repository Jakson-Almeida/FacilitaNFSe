var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.detectStep = function (pathname) {
  if (/\/DPS\/Pessoas/i.test(pathname)) return "pessoas";
  if (/\/DPS\/Servico/i.test(pathname)) return "servico";
  if (/\/DPS\/Tributacao/i.test(pathname)) return "tributacao";
  if (/\/DPS\/NFSe/i.test(pathname)) return "nfse";
  if (/\/DPS\/EmitirNFSe/i.test(pathname)) return "emitir";
  return null;
};

FacilitaNFSe.isEmissionFlowStep = function (step) {
  return step === "emitir" || step === "nfse";
};
