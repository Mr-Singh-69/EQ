const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Configuration
const PREFIX = process.env.PREFIX || '!'; // Prefix for non-slash commands
const TOKEN = process.env.TOKEN; // Bot token
const CLIENT_ID = process.env.CLIENT_ID; // Bot client ID

// Load prefix commands into a Collection
client.commands = new Collection();
const { loadCommands } = require('./handlers/commandHandler');
loadCommands(client);

// Load slash commands into a Collection
client.slashCommands = new Collection();
const slashCommands = [];
const slashCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        client.slashCommands.set(command.data.name, command);
        slashCommands.push(command.data.toJSON());
    }
}

// Register slash commands during startup
(async () => {
    try {
        console.log('Refreshing application (/) commands...');
        const rest = new REST({ version: '10' }).setToken(TOKEN);

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });

        console.log('Successfully registered (/) commands.');
    } catch (error) {
        console.error('Error registering (/) commands:', error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Slash Command Listener
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

// Prefix Command Listener
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
keepAlive();
// Log in to Discord
client.login(TOKEN);
