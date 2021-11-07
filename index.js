const log = console.log
log("Starting...")
//Discord.js bot initialisation
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

//Initialisation
const { readdirSync } = require("fs");
const path = require('path')
const chalk = require('chalk')

//Define the maps
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()


//Loads all commands
const loadCommands = async () => {
    const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
    for (const file of commands) {
      const command = require(`./commands/${file}`);
      log(`Loading Command: ${command.info.name}`);
      client.commands.set(command.info.name.toLowerCase(), command);
      command.conf.aliases.forEach(alias => {
        client.aliases.set(alias, command.info.name);
      });
    }
}
loadCommands()

const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }  

client.login(config.token);

client.on('ready', () => {
    log(`Logged in as ${client.user.tag}!`);
    log(`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
    client.user.setActivity('Bruh', { type: 'PLAYING' });
});

client.on('message', message => {
    message.content = message.content.toLowerCase()
    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()
        if (client.commands.has(command)) {
            try {
                client.commands.get(command).run(client, message, args)
            } catch (error) {
                console.error(error)
                message.reply('there was an error trying to execute that command!')
            }
        } else if (client.aliases.has(command)) {
            log(client.aliases.has(command))
            try {
                client.commands.get(client.aliases.get(command)).run(client, message, args)
            } catch (error) {
                console.error(error)
                message.reply('there was an error trying to execute that command!')
            }
        }
    }
});
