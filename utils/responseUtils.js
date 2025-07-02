const {EmbedBuilder} = require('discord.js');

function successEmbed(title, description) {
    return new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle(title)
        .setDescription(description);
}

function errorEmbed(title, description) {
    return new EmbedBuilder()
        .setColor('#cc0000')
        .setTitle(title)
        .setDescription(description);
}

module.exports = {successEmbed, errorEmbed};