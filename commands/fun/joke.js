const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Tells a random joke'),
    async execute(interaction) {
        const jokes = [
            "Why don’t skeletons fight each other? They don’t have the guts.",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await interaction.reply(randomJoke);
    },
};
