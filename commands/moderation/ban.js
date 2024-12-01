const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption(option => option.setName('user').setDescription('The member to ban').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        await interaction.reply(`${user.tag} has been banned.`);
    },
};
