const Discord = module.require("discord.js");
module.exports.run = async (bot , message , args)=>{


    let stat = new Discord.MessageEmbed()
    .setTitle(`${bot.user.username}'s Stats`)
    .addField(`Ping:`,`${Math.round(bot.ws.ping)}ms`)
    .addField(`GateWay:`,`${bot.ws.gateway}`);
    message.channel.send(stat)


}
module.exports.help={
  name:"stats",
  help:"Server Stats"
}