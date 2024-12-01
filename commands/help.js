const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all commands and their descriptions'),
    async execute(interaction, client) {
        const prefixCommands = client.commands.map((cmd) => `**${cmd.name}**: ${cmd.description}`).join('\n');

        await interaction.reply({
            content: `Here are the commands:\n\n${prefixCommands}`,
            ephemeral: true,
        });
    },
};
