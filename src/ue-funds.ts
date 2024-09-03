export const processEuFundsLinks = (links: string[]): string[] => {
  const noRequired = [
    "https://funduszeue.slaskie.pl/",
    "https://funduszeue.slaskie.pl/OProgramie/",
    "https://funduszeue.slaskie.pl/czytaj/dowiedz_sie_o_instytucjach_w_programie",
    "https://funduszeue.slaskie.pl/czytaj/instytucje_posredniczace",
    "https://funduszeue.slaskie.pl/czytaj/wojewodzki_urzad_pracy_w_katowicach",
    "https://funduszeue.slaskie.pl/czytaj/znajdz_dofinansowanie_projekty_wup",
    "https://funduszeue.slaskie.pl/czytaj/osoby_fizyczne",
    // "https://funduszeue.slaskie.pl/czytaj/5_4_aktywizacja_zawodowa_13082024",
    "#ocena",
  ];
  return links.filter((link) => !noRequired.includes(link));
};
