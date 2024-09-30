import { Client } from "pg";
import path from "path";

interface Article {
  text: string[];
  images: string[];
}

export class ArticleManager {
  private client: Client;
  private tableName: string;

  constructor(filePath: string) {
    this.tableName = path.basename(filePath, ".json");
    this.client = new Client({
      user: "zakrzaq",
      host: "localhost",
      database: "oberon_db",
      password: "Ella0957!",
      port: 5432,
    });
    this.client.connect().then(() => this.initializeTable());
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
  }

  private async getDownloadedArticles(): Promise<Article[]> {
    const res = await this.client.query(
      `SELECT text, images FROM ${this.tableName}`,
    );
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
  }
}
