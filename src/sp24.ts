import puppeteer from "puppeteer";
import { sendSp24Messages } from "./telegram";
import { ArticleManager } from "./libs/ArticleManager";

export const sp24Task = async () => {
  const articleManager = new ArticleManager("downloadedSp24.json");

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
      .filter((article) => article.text.length > 0 && article.images.length > 0)
      .slice(0, 3);

    return notEmptyArticles;
  });

  const newArticles = await articleManager.getNewArticles(articles);

  if (newArticles.length > 0) {
    sendSp24Messages(newArticles);

    // Save new articles
    await articleManager.saveArticles(newArticles);
    console.log("New articles saved.");
  } else {
    console.log("No new articles found.");
  }

  await articleManager.close(); // Close the database connection
  await browser.close();
};
