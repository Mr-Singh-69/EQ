module.exports = {
    name: 'joke',
    description: 'Tells a random joke',
    execute(message, args) {
        const jokes = [
            "Why don’t skeletons fight each other? They don’t have the guts.",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        message.reply(randomJoke);
    },
};
