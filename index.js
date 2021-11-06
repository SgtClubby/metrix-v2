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
      client.commands.set(command.info.name, command);
      command.conf.aliases.forEach(alias => {
        client.aliases.set(alias, command.name);
      });
    }
}
loadCommands()

// //Loads all events
// const loadEvents = (dir) => {
//     log("Loading all events...")
//     fs.readdir(dir, (err, files) => {
//         if (err) return console.error(err)
//         files.forEach(file => {
//             const event = require(path.join(dir, file))
//             let eventName = file.split('.')[0]
//             client.on(eventName, event.bind(null, bot))
//             delete require.cache[require.resolve(`${dir}/${file}`)]
//         })
//     })
// }
// loadEvents('/home/assas/metrix-v2/events')

client.login(config.token);

client.on('ready', () => {
    log(`Logged in as ${client.user.tag}!`);
    //log(`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
    client.user.setActivity('Bruh', { type: 'PLAYING' });
});

client.on('message', message => {
    // message.content = message.content.toLowerCase()
    log(message.content)
    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
        log(args)
        const command = args.shift().toLowerCase()
        log(command)

        if (client.commands.has(command)) {
            try {
                client.commands.get(command).execute(message, args)
            } catch (error) {
                console.error(error)
                message.reply('there was an error trying to execute that command!')
            }
        } else if (client.aliases.has(command)) {
            try {
                client.commands.get(client.aliases.get(command)).execute(message, args)
            } catch (error) {
                console.error(error)
                message.reply('there was an error trying to execute that command!')
            }
        }
    }
});
