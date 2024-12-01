const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Prefix for non-slash commands
const PREFIX = '!';

// Load commands into a Collection
client.commands = new Collection();
const { loadCommands } = require('./handlers/commandHandler');
loadCommands(client);

// Load help command as a slash command
client.slashCommands = new Collection();
const helpCommand = require('./commands/help.js');
client.slashCommands.set(helpCommand.data.name, helpCommand);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Slash Command Listener (for help command)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

// Prefix Command Listener (for other commands)
client.on('messageCreate', (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing this command!');
    }
});

// Log in to Discord
client.login(process.env.TOKEN);
