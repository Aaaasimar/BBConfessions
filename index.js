// Load up the discord.js library and create an instance
const Discord = require("discord.js");
const client = new Discord.Client();

// Load the config file into environment variables
require('dotenv').config()

// Declare variables for channels
// Need to make sure they're globally scoped
var confessChannel
var loggingChannel

// Once the bot has successfully logged in.
client.on('ready', () => {

    // Get the text channel that the confession should be logged to.
    client.channels.fetch(process.env.CONFESS_CHANNEL_ID).then((channel) => {
        loggingChannel = channel;

        // The bot expects to post into text channels
        if (loggingChannel.type !== "text") {
            console.error("The logging channel failed to load because is not a text channel.")
        } else {
            console.log(`The logging channel has been successfully loaded.`);
        }
    });

    // Get the text channel that should be logged to
    client.channels.fetch(process.env.LOGGING_CHANNEL_ID).then((channel) => {
        confessChannel = channel;

        // The bot expects to post into text channels
        if (confessChannel.type !== "text") {
            console.error("The confession channel failed to load because is not a text channel.")
        } else {
            console.log(`The confession channel has been successfully loaded.`);
        }
    })

    console.log('The bot has been successfully loaded!');

});


client.on('message', message => {
    // Only post confessions for direct messages
    if (message.channel.type === "dm") {
        console.log(`DM received from ${message.author}: ${message.content}`)

        // Loging the message
        loggingChannel.send(
            new Discord.MessageEmbed({
                color: "#FFC0CB", //Light pink
                fields: [
                    {
                        name: "User",
                        value: message.author,
                        inline: false
                    },
                    {
                        name: "Message",
                        value: message.content,
                        inline: false
                    },
                    {
                        name: "Date",
                        value: message.createdAt,
                        inline: false
                    },
                ]
            }))

        // Post the confession message
        confessChannel.send(new Discord.MessageEmbed({
            color: "#FFC0CB",
            title: "Anonymous Confession.",
            description: message.content
        }));


    } else {
        // Logging to console but no action
        console.log(`Non-DM message received.`)
    }
});

client.login(process.env.TOKEN);