# greg_bot [RU](README_RU.md)

The bot is designed to provide users with entertaining content through slash commands, offering features such as
sending random cat images and NSFW content in dm.

[![Project Preview](https://i.postimg.cc/wB3GS5Gy/image.png)](https://postimg.cc/67JcZZwt)

## Table of Contents

- [Installation](#installation)
- [Config](#config)
- [Important](#important)
- [Technologies Used](#technologies-used)
- [Project Status](#project-status)

## Installation

To use this project, follow these steps:

1. **Clone the Repository:**
   Ensure that Git is installed on your system.
   ```bash
   git clone https://github.com/GogaNotClown/greg_bot.git
   cd greg_bot
   ```

2. **Download NPM packages:**
   Ensure that Node.js is installed on your system.
   ```bash
   npm install
   ```

3. **Start the Bot:**
   To activate the bot, run the following command. Before executing, ensure you have inserted your bot token, client ID,
   and guild ID in the .env file.
   ```bash
   node index.js
   ```

## Config

The configuration for this bot is stored in the .env file, where you need to set up the following environment variables:

```bash
DISCORD_TOKEN: Your Discord bot token.
CLIENT_ID: Your Discord bot client ID.
GUILD_ID: Your Discord server ID.
```

## Important

To add your Discord bot to your server, please follow the steps outlined below. This process is crucial because the bot
utilizes the latest version of discord.js and implements slash commands, thus requiring a different approach to inviting
it:

1. **Intents:**
   Once you've created your Discord Bot on the [Discord Developer Portal](https://discord.com/developers/applications),
   navigate to the `Bot` tab. From there, toggle on the `PRESENCE`, `SERVER MEMBERS`, and `MESSAGE CONTENT` intents.
   Enabling these intents allows your Discord bot to respond to slash commands effectively.

   [![Intents Screen](https://i.postimg.cc/jjz7qm9G/image.png)](https://postimg.cc/2qS62cCw)

2. **OAuth2**
   Next, navigate to the `OAuth2` tab and select the checkboxes labeled `bot` and `applications.commands` in the OAuth2
   URL Generator (scopes) section. Then, in the OAuth2 URL Generator (bot permissions) section, check
   the `Administrator` permission. Ensure that the Integration type is set to "Guild Install," and you'll find the bot
   link below.

   [![OAuth2 Screen](https://i.postimg.cc/ZY1v3TS1/image.png)](https://postimg.cc/Z0xqzz0c)

## Technologies Used

- [Node.js](https://nodejs.org/en)
- [Discord.js](https://discord.js.org/)
- [Axios](https://axios-http.com/)

## Project Status

Completed
