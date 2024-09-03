import axios from "axios";
import puppeteer from "puppeteer";
import { scheduleJob } from "node-schedule";
import { processEuFundsLinks } from "./ue-funds";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const tasks = [
  {
    id: 1,
    name: "EU Funds Slaskie",
    url: "https://funduszeue.slaskie.pl/czytaj/inne_szkolenia_dotacje_outplacement",
    runtimes: ["09:00", "16:00", "21:30"],
  },
];

const sendTelegramMessage = async (message: string) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log("Message sent successfully via Telegram");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send message via Telegram:", error.message);
    } else {
      console.error(
        "Failed to send message via Telegram: Unknown error",
        error,
      );
    }
  }
};

const getLinksFromDiv = async (url: string): Promise<string[]> => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll("#main-content a[href]");
      return Array.from(anchorElements)
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href) => href) as string[];
    });

    await browser.close();
    return links;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error fetching the webpage with Puppeteer:",
        error.message,
      );
    } else {
      console.error(
        "Error fetching the webpage with Puppeteer: Unknown error",
        error,
      );
    }
    return [];
  }
};

const runTask = async (task: {
  id: number;
  name: string;
  url: string;
  runtimes: string[];
}) => {
  console.log(`Running task: ${task.name}`);
  let links = await getLinksFromDiv(task.url);

  if (links.length > 0) {
    if (task.id === 1) links = processEuFundsLinks(links);
    const message = `Links found for ${task.name} on the page ${task.url}:\n\n${links.join("\n")}`;
    await sendTelegramMessage(message);
  } else {
    console.log(`No links found for ${task.name}`);
  }
};

const scheduleTasks = () => {
  tasks.forEach((task) => {
    runTask(task);

    task.runtimes.forEach((runtime) => {
      const [hour, minute] = runtime.split(":").map(Number);
      const cronExpression = `${minute} ${hour} * * *`;

      scheduleJob(cronExpression, () => {
        runTask(task);
      });

      console.log(`Scheduled task '${task.name}' for ${runtime}`);
    });
  });
};

scheduleTasks();
