// Discord Slash Commands
const {SlashCommandBuilder} = require('@discordjs/builders');

// HTTP
const axios = require('axios');

// Utils
const {parseTime} = require('../utils/parseTime.js');
const {successEmbed, errorEmbed} = require('../utils/responseUtils.js');

// API Request
async function getRandomCatImage() {
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        if (response.data?.[0]?.url) {
            return {success: true, url: response.data[0].url};
        }
        return {success: false, error: 'Failed to fetch a cat image.'};
    } catch (error) {
        console.error('Error fetching cat image:', error);
        return {success: false, error: 'Failed to fetch a cat image.'};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcat')
        .setDescription('Send a random cat image in a private message')
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
                .setDescription('Interval for sending cat images (e.g., 5m, 1h)')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const interval = interaction.options.getString('interval');
        const action = interaction.options.getString('action');

        if (action === 'stop') {
            const timer = client.catTimers.get(interaction.user.id);
            if (timer) {
                clearInterval(timer);
                client.catTimers.delete(interaction.user.id);
                await interaction.reply({embeds: [successEmbed('Success', 'Cat subscription stopped.')]});
            } else {
                await interaction.reply({embeds: [errorEmbed('Error', 'You do not have an active cat subscription.')]});
            }
            return;
        }

        // Start subscription
        const duration = parseTime(interval);
        if (!duration || duration < 60 * 1000) {
            await interaction.reply({embeds: [errorEmbed('Error', 'Invalid interval. Use at least 1m (minutes), h, d, or w.')]});
            return;
        }

        if (client.catTimers.has(interaction.user.id)) {
            await interaction.reply({
                embeds: [errorEmbed('Error', 'You already have an active subscription. Use `/randomcat action stop` to cancel it.')]
            });
            return;
        }

        let timer;
        try {
            const catImageResult = await getRandomCatImage();
            if (!catImageResult.success) {
                await interaction.reply({
                    embeds: [errorEmbed('Error', catImageResult.error)]
                });
                return;
            }

            try {
                await interaction.user.send({content: catImageResult.url});
            } catch (err) {
                console.error(`DM failed for ${interaction.user.tag}:`, err);
                await interaction.reply({
                    embeds: [errorEmbed('Error', 'Could not send DM. Please enable messages from server members.')]
                });
                return;
            }

            timer = setInterval(async () => {
                const res = await getRandomCatImage();
                if (res.success) {
                    try {
                        await interaction.user.send({content: res.url});
                    } catch (err) {
                        console.error(`Failed DM to ${interaction.user.tag} (${interaction.user.id}):`, err);
                        clearInterval(timer);
                        client.catTimers.delete(interaction.user.id);
                    }
                } else {
                    console.error(`Error fetching cat image for ${interaction.user.id}:`, res.error);
                }
            }, duration);

            client.catTimers.set(interaction.user.id, timer);

            await interaction.reply({
                embeds: [successEmbed('Success', `Cat subscription started! You'll get a new image every **${interval}**.`)]
            });
        } catch (error) {
            if (timer) clearInterval(timer);
            console.error('Subscription setup failed:', error);
            await interaction.reply({
                embeds: [errorEmbed('Error', error.message || 'Failed to start cat subscription.')]
            });
        }
    }
};