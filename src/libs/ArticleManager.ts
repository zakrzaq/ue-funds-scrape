import { Client } from "pg";
import path from "path";
import { pgConfig } from "../services/db";
import logger from "../services/logger";

interface Article {
  text: string[];
  images: string[];
}

export class ArticleManager {
  private client: Client;
  private tableName: string;

  constructor(filePath: string) {
    this.tableName = path.basename(filePath);
    this.client = new Client({ ...pgConfig });
    this.client.connect().then(() => {
      logger.info(`Connected to database: ${this.tableName}`);
      this.initializeTable();
    });
  }

  private async initializeTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id SERIAL PRIMARY KEY,
        text TEXT[] NOT NULL,
        images TEXT[] NOT NULL
      );
    `;
    await this.client.query(createTableQuery);
  }

  public async saveArticles(articles: Article[]) {
    const insertQueries = articles.map((article) => {
      const textArray = article.text;
      const imagesArray = article.images;
      return `INSERT INTO ${this.tableName} (text, images) VALUES (ARRAY[${textArray.map((t) => `'${t}'`).join(", ")}], ARRAY[${imagesArray.map((i) => `'${i}'`).join(", ")}])`;
    });

    await Promise.all(insertQueries.map((query) => this.client.query(query)));
    logger.info(`Articles saved to database: ${this.tableName}`);
  }

  private async getDownloadedArticles(): Promise<Article[]> {
    const res = await this.client.query(
      `SELECT text, images FROM ${this.tableName}`,
    );
    logger.info("Articles retrieved from database");
    return res.rows.map((row) => ({
      text: row.text,
      images: row.images,
    }));
  }

  public async getNewArticles(articles: Article[]): Promise<Article[]> {
    const downloadedArticles = await this.getDownloadedArticles();
    return articles.filter(
      (article) =>
        !downloadedArticles.some(
          (downloadedArticle) =>
            article.text[0] === downloadedArticle.text[0] &&
            article.images[0] === downloadedArticle.images[0],
        ),
    );
  }

  public async close() {
    await this.client.end();
    logger.info(`Disconnected from database: ${this.tableName}`);
  }
}
