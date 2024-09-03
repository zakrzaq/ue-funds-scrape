module.exports = {
  apps: [
    {
      name: "eu-funds-scape",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        TELEGRAM_BOT_TOKEN: "6993230820:AAEZ6poIZYwt-K5qe8Rn1cAfF7dO25F0EKQ",
        TELEGRAM_CHAT_ID: "7510172345",
      },
    },
  ],
};
