var FacilitaNFSe = self.FacilitaNFSe;

FacilitaNFSe.detectStep = function (pathname) {
  if (/\/DPS\/Pessoas/i.test(pathname)) return "pessoas";
  if (/\/DPS\/Servico/i.test(pathname)) return "servico";
  if (/\/DPS\/Tributacao/i.test(pathname)) return "tributacao";
  if (/\/DPS\/EmitirNFSe/i.test(pathname)) return "emitir";
  return null;
};
