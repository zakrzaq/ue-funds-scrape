import axios from "axios";

const TELEGRAM_BOT_TOKEN = "7379152910:AAEOKIPQ07CDRvwKOW2_vM9Ri2gVngDlYKI";

const getChatId = async () => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
    );
    const updates = response.data.result;

    if (updates.length > 0) {
      const chatId = updates[updates.length - 1].message.chat.id;
      console.log("Your Telegram Chat ID is:", chatId);
    } else {
      console.log(
        "No messages found. Send a message to your bot and try again.",
      );
    }
  } catch (error) {
    console.error("Error fetching updates:", error);
  }
};

getChatId();
