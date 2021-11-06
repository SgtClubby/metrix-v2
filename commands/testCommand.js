exports.run = (client, message, args) => {
    message.channel.send("pong!").catch(console.error);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["test", "test2"],
    permLevel: "User"
};
  
exports.info = {
    name: "testCommand",
    category: "Testing",
    description: "Command used for testing",
    usage: "testCommand - Returns a string."
};