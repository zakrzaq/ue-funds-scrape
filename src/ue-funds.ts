import puppeteer from "puppeteer";
import { sendUeMessage } from "./telegram";
import logger from "./services/logger";

const processEuFundsLinks = (links: string[]): string[] => {
  const noRequired = [
    "https://funduszeue.slaskie.pl/",
    "https://funduszeue.slaskie.pl/OProgramie/",
    "https://funduszeue.slaskie.pl/czytaj/dowiedz_sie_o_instytucjach_w_programie",
    "https://funduszeue.slaskie.pl/czytaj/instytucje_posredniczace",
    "https://funduszeue.slaskie.pl/czytaj/wojewodzki_urzad_pracy_w_katowicach",
    "https://funduszeue.slaskie.pl/czytaj/znajdz_dofinansowanie_projekty_wup",
    "https://funduszeue.slaskie.pl/czytaj/osoby_fizyczne",
    "https://funduszeue.slaskie.pl/czytaj/5_4_aktywizacja_zawodowa_13082024",
    "#ocena",
  ];
  return links.filter((link) => !noRequired.includes(link));
};

const getUeFundsLinks = async (): Promise<string[]> => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      "https://funduszeue.slaskie.pl/czytaj/inne_szkolenia_dotacje_outplacement",
      { waitUntil: "networkidle2" },
    );

    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll("#main-content a[href]");
      return Array.from(anchorElements)
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href) => href) as string[];
    });

    await browser.close();
    return processEuFundsLinks(links);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error fetching the webpage with Puppeteer:", error.message);
    } else {
      logger.error(
        "Error fetching the webpage with Puppeteer: Unknown error",
        error,
      );
    }
    return [];
  }
};

export const UeFundsTask = async () => {
  try {
    const result = await getUeFundsLinks();
    if (result.length >= 1) {
      const message = `Links found for UE FUNDS:\n\n${result.join("\n")}`;
      await sendUeMessage(message);
    } else {
      logger.warn(`No links found for EU FUNDS`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error fetching the webpage with Puppeteer:", error.message);
    } else {
      logger.error(
        "Error fetching the webpage with Puppeteer: Unknown error",
        error,
      );
    }
  }
};
