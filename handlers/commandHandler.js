const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(folderPath, file));
            if (command.name && command.execute) {
                client.commands.set(command.name, command);
            } else {
                console.error(`Command at ${file} is missing "name" or "execute" property.`);
            }
        }
    }
}

module.exports = { loadCommands };

