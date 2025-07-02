# greg_bot

The bot is designed to provide users with entertaining content through slash commands, offering features such as
sending random cat images and NSFW content in dm.

![Project Preview](https://i.postimg.cc/J7N9J6Lg/image.png)

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
   node index.js OR node .
   ```

## Config

The configuration for this bot is stored in the .env file, where you need to set up the following environment variables:

```bash
DISCORD_TOKEN: Discord bot token.
CLIENT_ID: Discord bot client ID.
GUILD_ID: Discord server ID.
NIGHT_API_KEY: API KEY for NSFW Images - https://night-api.com/
```

## Important

To add your Discord bot to your server, please follow the steps outlined below. This process is crucial because the bot
utilizes the latest version of discord.js and implements slash commands, thus requiring a different approach to inviting
it:

1. **Intents:**
   Once you've created your Discord Bot on the [Discord Developer Portal](https://discord.com/developers/applications),
   navigate to the `Bot` tab. From there, toggle on the `PRESENCE`, `SERVER MEMBERS`, and `MESSAGE CONTENT` intents.
   Enabling these intents allows your Discord bot to respond to slash commands effectively.

   ![Intents Screen](https://i.postimg.cc/SsWt6sw8/image.png)

2. **OAuth2**
   Next, navigate to the `OAuth2` tab and select the checkboxes labeled `bot` and `applications.commands` in the
   OAuth2 URL Generator (scopes) section. Then, in the OAuth2 URL Generator (bot permissions) section, check
   the `Administrator` permission. Ensure that the Integration type is set to "Guild Install," and you'll find the bot
   link below.

   ![OAuth2 Screen](https://i.postimg.cc/c1Bb6v7G/image.png)

## Technologies Used

- [Node.js](https://nodejs.org/en)
- [Discord.js](https://discord.js.org/)
- [@discordjs/builders](https://discord.js.org/#/docs/builders)
- [@discordjs/rest](https://discord.js.org/#/docs/rest)
- [discord-api-types](https://github.com/discordjs/discord-api-types)
- [Axios](https://axios-http.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [@sefinek/random-animals](https://www.npmjs.com/package/@sefinek/random-animals)
- [night-api](https://www.npmjs.com/package/night-api)

## Project Status

Supported
