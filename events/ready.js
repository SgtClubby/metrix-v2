const logger = require("../modules/Logger.js");
const { getSettings } = require("../modules/functions.js");
module.exports = async client => {
  // Log that the bot is online.
  logger.log(`${client.user.tag}, serving ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
  logger.log(`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`, "ready");
  
  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${getSettings("default").prefix}help`, { type: "PLAYING" });
};
