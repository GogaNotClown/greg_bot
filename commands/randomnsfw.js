// Discord Slash Commands
const {SlashCommandBuilder} = require('@discordjs/builders');

// API
const {NightAPI} = require('night-api');
const NIGHT_API_KEY = process.env.NIGHT_API_KEY;
const api = new NightAPI(NIGHT_API_KEY);

// Utils
const {parseTime} = require('../utils/parseTime.js');
const {successEmbed, errorEmbed} = require('../utils/responseUtils.js');

// API Request
async function getRandomNSFWImage() {
    try {
        const nsfwImage = await api.nsfw.fetchImage();
        return {success: true, url: nsfwImage.content.url};
    } catch (error) {
        console.error('Error fetching NSFW image:', error);
        return {success: false, error: 'Failed to fetch an NSFW image.'};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomnsfw')
        .setDescription('Send a random NSFW image in a private message')
        .addStringOption(option =>
            option
                .setName('action')
                .setDescription('Action (start or stop)')
                .setRequired(true)
                .addChoices(
                    {name: 'Start subscription', value: 'start'},
                    {name: 'Stop subscription', value: 'stop'}
                )
        )
        .addStringOption(option =>
            option
                .setName('interval')
                .setDescription('Interval for sending NSFW images (e.g., 5m, 1h)')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const interval = interaction.options.getString('interval');
        const action = interaction.options.getString('action');

        if (action === 'stop') {
            const timer = client.nsfwTimers.get(interaction.user.id);
            if (timer) {
                clearInterval(timer);
                client.nsfwTimers.delete(interaction.user.id);
                await interaction.reply({embeds: [successEmbed('Success', 'Subscription stopped.')]});
            } else {
                await interaction.reply({embeds: [errorEmbed('Error', 'You do not have an active subscription.')]});
            }
            return;
        }

        // Start subscription
        const duration = parseTime(interval);
        if (!duration || duration < 60 * 1000) {
            await interaction.reply({embeds: [errorEmbed('Error', 'Invalid interval. Use at least 1m (minutes), h, d, or w.')]});
            return;
        }

        if (client.nsfwTimers.has(interaction.user.id)) {
            await interaction.reply({
                embeds: [errorEmbed('Error', 'You already have an active subscription. Use `/randomnsfw action stop` to cancel it.')]
            });
            return;
        }

        let timer;
        try {
            const nsfwImageResult = await getRandomNSFWImage();
            if (!nsfwImageResult.success) {
                await interaction.reply({
                    embeds: [errorEmbed('Error', nsfwImageResult.error)]
                });
                return;
            }

            try {
                await interaction.user.send({content: nsfwImageResult.url});
            } catch (err) {
                console.error(`DM failed for ${interaction.user.tag}:`, err);
                await interaction.reply({
                    embeds: [errorEmbed('Error', 'Could not send DM. Please enable messages from server members.')]
                });
                return;
            }

            timer = setInterval(async () => {
                const res = await getRandomNSFWImage();
                if (res.success) {
                    try {
                        await interaction.user.send({content: res.url});
                    } catch (err) {
                        console.error(`Failed DM to ${interaction.user.tag} (${interaction.user.id}):`, err);
                        clearInterval(timer);
                        client.nsfwTimers.delete(interaction.user.id);
                    }
                } else {
                    console.error(`Error fetching NSFW image for ${interaction.user.id}:`, res.error);
                }
            }, duration);

            client.nsfwTimers.set(interaction.user.id, timer);

            await interaction.reply({
                embeds: [successEmbed('Success', `Subscription started! You'll get a new image every **${interval}**.`)]
            });
        } catch (error) {
            if (timer) clearInterval(timer);
            console.error('Subscription setup failed:', error);
            await interaction.reply({embeds: [errorEmbed('Error', error.message || 'Failed to start subscription.')]});
        }
    }
};