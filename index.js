const log = console.log
log("Starting...")
//Discord.js bot initialisation
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

//Initialisation
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

//Loads all commands and aliases
const loadCommands = (dir) => {
    log("Loading all commands...")
    fs.readdir(dir, (err, files) => {
        if (err) return console.error(err)
        files.forEach(file => {
            if (!file.endsWith('.js')) return
            const command = require(path.join(dir, file))
            bot.commands.set(command.name, command)
            if (command.aliases) command.aliases.forEach(alias => bot.aliases.set(alias, command.name))
        })
    })
}

//Loads all events
const loadEvents = (dir) => {
    log("Loading all events...")
    fs.readdir(dir, (err, files) => {
        if (err) return console.error(err)
        files.forEach(file => {
            const event = require(path.join(dir, file))
            let eventName = file.split('.')[0]
            bot.on(eventName, event.bind(null, bot))
            delete require.cache[require.resolve(`${dir}/${file}`)]
        })
    })
}

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

loadCommands('./commands')
loadEvents('./events')

client.login(config.token);

client.on('ready', () => {
    log(`Logged in as ${client.user.tag}!`);
    log(`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
    client.user.setActivity('over the people!', { type: 'WATCHING' });
});

