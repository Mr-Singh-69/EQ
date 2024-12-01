const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
            console.log(`Loaded command: ${command.name}`);
        } else {
            console.warn(`Skipping file: ${file} (missing command name)`);
        }
    }
}

module.exports = { loadCommands };
