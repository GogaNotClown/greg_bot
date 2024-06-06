const {SlashCommandBuilder} = require('@discordjs/builders'); // Import SlashCommandBuilder from discord.js builders
const axios = require('axios'); // Import axios for making HTTP requests
const {parseTime} = require('../utils.js'); // Import function parseTime function from utils.js file

async function getRandomCatImage() {
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search'); // Fetch a random cat image from TheCatAPI
        if (response.data && response.data[0] && response.data[0].url) {
            return {success: true, url: response.data[0].url}; // Return the image URL if successful
        }
        return {success: false, error: 'Failed to fetch a cat image.'};
    } catch (error) {
        console.error('Error fetching cat image:', error); // Log error if fetching failed
        return {success: false, error: 'Failed to fetch a cat image.'};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcat')
        .setDescription('Send a random cat image in a private message')
        .addStringOption(option =>
            option.setName('interval')
                .setDescription('Interval for sending cat images (e.g., 5m, 1h)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action (start or stop)')
                .setRequired(false)),
    async execute(interaction, client) {
        const interval = interaction.options.getString('interval');
        const action = interaction.options.getString('action');

        if (action === 'stop') {
            const timer = client.catTimers.get(interaction.user.id);
            if (timer) {
                clearInterval(timer);
                client.catTimers.delete(interaction.user.id);
                await interaction.reply('Subscription stopped.');
            } else {
                await interaction.reply('You do not have an active subscription.');
            }
            return;
        }

        if (interval) {
            const duration = parseTime(interval);
            if (!duration) {
                await interaction.reply('Invalid time format. Use m (minutes), h (hours), d (days), w (weeks).');
                return;
            }

            if (client.catTimers.has(interaction.user.id)) {
                await interaction.reply('You already have an active subscription.');
                return;
            }

            const catImageResult = await getRandomCatImage();
            if (!catImageResult.success) {
                await interaction.reply(catImageResult.error);
                return;
            }

            await interaction.user.send({content: catImageResult.url});

            const timer = setInterval(async () => {
                const catImageResult = await getRandomCatImage();
                if (catImageResult.success) {
                    await interaction.user.send({content: catImageResult.url});
                } else {
                    console.error('Error fetching cat image:', catImageResult.error);
                }
            }, duration);

            client.catTimers.set(interaction.user.id, timer);
            await interaction.reply(`Cat image subscription set to every ${interval}.`);
        } else {
            const catImageResult = await getRandomCatImage();
            if (catImageResult.success) {
                await interaction.user.send({content: catImageResult.url});
                await interaction.reply('Enjoy your cat image.');
            } else {
                await interaction.reply(catImageResult.error);
            }
        }
    },
};