const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args) =>{
    const msg = await message.channel.send(`Pinging`);
    msg.edit(`Pong!! \n Latency: ${Math.floor(msg.createdAt - message.createdAt )}ms \n API Latency: ${Math.round(bot.ws.ping)}ms`);
}
module.exports.help ={
    name:"ping",
    help:"Bot Latency"
}