require('dotenv').config(); // Load environment variables from .env file

const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const fs = require('fs');
const path = require('path');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

// Check if required environment variables are set
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
    console.error('Missing required environment variables. Please ensure DISCORD_TOKEN, CLIENT_ID, and GUILD_ID are set.');
    process.exit(1);
}

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

client.commands = new Collection(); // Collection to store commands
client.nsfwTimers = new Map(); // Map to store NSFW timers
client.catTimers = new Map(); // Map to store cat timers

const commandsPath = path.join(__dirname, 'commands'); // Path to commands directory
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get command files from directory

const commands = []; // Array to store command data

// Load commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// When the bot is ready
client.once('ready', () => {
    console.log(`Bot is ready!`);
    client.user.setStatus('dnd');
});

// Interaction event handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; // Ignore if not a command interaction

    const command = client.commands.get(interaction.commandName);

    if (!command) return; // If command not found, ignore

    try {
        await command.execute(interaction, client); // Execute the command
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});

client.login(process.env.DISCORD_TOKEN); // Login the client with the bot token

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN); // Create a REST client

// Refresh application (/) commands
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands},
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error while refreshing application (/) commands:', error);
    }
})();