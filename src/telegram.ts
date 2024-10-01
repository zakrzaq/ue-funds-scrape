import axios from "axios";
import logger from "./services/logger";

require("dotenv").config();

export const sendTelegramMessage = async (
  bot: string,
  chatId: string,
  message: string,
) => {
  const url = `https://api.telegram.org/bot${bot}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    logger.info("Message sent successfully via Telegram");
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Failed to send message via Telegram:", error.message);
    } else {
      logger.error("Failed to send message via Telegram: Unknown error", error);
    }
  }
};

export const sendTelegramPicture = async (
  bot: string,
  chatId: string,
  photo: string,
) => {
  const url = `https://api.telegram.org/bot${bot}/sendPhoto`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      photo: photo,
    });
    logger.info("Message sent successfully via Telegram");
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Failed to send message via Telegram:", error.message);
    } else {
      logger.error("Failed to send message via Telegram: Unknown error", error);
    }
  }
};

export const sendUeMessage = async (message: string) => {
  const EU_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
  const EU_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

  sendTelegramMessage(EU_BOT_TOKEN, EU_CHAT_ID, message);
};

interface Sp24Message {
  text: string[];
  images: string[];
}

export const sendSp24Messages = async (sp24Messages: Sp24Message[]) => {
  const SP24_BOT_TOKEN = process.env.SP24_BOT_TOKEN || "";
  const SP24_CHAT_ID = process.env.SP24_CHAT_ID || "";

  sp24Messages.forEach((message) => {
    if (message.text.length > 1) {
      const text = message.text.join("\n");
      sendTelegramMessage(SP24_BOT_TOKEN, SP24_CHAT_ID, text);
    }

    if (message.images.length > 0) {
      message.images.forEach((imgUrl) => {
        sendTelegramPicture(SP24_BOT_TOKEN, SP24_CHAT_ID, imgUrl);
      });
    }
  });
};
