const {SlashCommandBuilder} = require('@discordjs/builders'); // Import SlashCommandBuilder from discord.js builders
const akaneko = require('akaneko'); // Import akaneko for fetching NSFW images
const {parseTime} = require('../utils.js'); // Import function parseTime function from utils.js file

async function getRandomNSFWImage() {
    try {
        const nsfwImage = await akaneko.nsfw.hentai(); // Fetch a random NSFW image using akaneko
        return {success: true, url: nsfwImage};
    } catch (error) {
        console.error('Error fetching NSFW image:', error); // Log error if fetching failed
        return {success: false, error: 'Failed to fetch an NSFW image.'};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomnsfw')
        .setDescription('Send a random NSFW image in a private message')
        .addStringOption(option =>
            option.setName('interval')
                .setDescription('Interval for sending NSFW images (e.g., 5m, 1h)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action (start or stop)')
                .setRequired(false)),
    async execute(interaction, client) {
        const interval = interaction.options.getString('interval');
        const action = interaction.options.getString('action');

        if (action === 'stop') {
            const timer = client.nsfwTimers.get(interaction.user.id);
            if (timer) {
                clearInterval(timer);
                client.nsfwTimers.delete(interaction.user.id);
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

            if (client.nsfwTimers.has(interaction.user.id)) {
                await interaction.reply('You already have an active subscription.');
                return;
            }

            const nsfwImageResult = await getRandomNSFWImage();
            if (!nsfwImageResult.success) {
                await interaction.reply(nsfwImageResult.error);
                return;
            }

            await interaction.user.send({content: nsfwImageResult.url});

            const timer = setInterval(async () => {
                const nsfwImageResult = await getRandomNSFWImage();
                if (nsfwImageResult.success) {
                    await interaction.user.send({content: nsfwImageResult.url});
                } else {
                    console.error('Error fetching NSFW image:', nsfwImageResult.error);
                }
            }, duration);

            client.nsfwTimers.set(interaction.user.id, timer);
            await interaction.reply(`NSFW image subscription set to every ${interval}.`);
        } else {
            const nsfwImageResult = await getRandomNSFWImage();
            if (nsfwImageResult.success) {
                await interaction.user.send({content: nsfwImageResult.url});
                await interaction.reply('Enjoy your NSFW image.');
            } else {
                await interaction.reply(nsfwImageResult.error);
            }
        }
    },
};