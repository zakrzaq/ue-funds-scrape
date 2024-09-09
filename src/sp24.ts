import puppeteer from "puppeteer";
import { sendSp24Messages } from "./telegram";

export const sp24Task = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.sp24.halemba.edu.pl");

  const articles = await page.evaluate(() => {
    const articleElements = Array.from(
      document.querySelectorAll("article.art-post"),
    );
    const articlesContent = articleElements.map((article) => {
      const text = Array.from(article.querySelectorAll("p")).map(
        (p) => p.innerText?.trim() || "",
      );
      let images = Array.from(article.querySelectorAll("img")).map(
        (img) =>
          `${"https://www.sp24.halemba.edu.pl"}${img.getAttribute("src") || ""}`,
      );
      return { text, images };
    });

    const notEmptyArticles = articlesContent
      .filter((article) => {
        if (article.text.length > 0 && article.images.length > 0) {
          return article;
        }
      })
      .slice(0, 3);

    return notEmptyArticles;
  });

  sendSp24Messages(articles);
};
