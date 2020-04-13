const Discord = module.require('discord.js');
const basic = require('../Config.json')
const package = require('../package.json')
module.exports.run = async (bot , message , args)=>{
  const author= new Discord.MessageEmbed();
  author.setTitle('Author of the Bot')
  author.addField('Author:', "Jenil_09.gif")
  author.addField('Version:', `${package.version}`)
  author.addField('Server:', message.guild.name)
  author.setThumbnail("https://cdn.discordapp.com/avatars/255649984546996225/41422c2778dc1096ac1e22bc1956ca2f.png?size=2048")
  author.setColor(0xF1C40F)
  author.setFooter(`${package.description}`);
  message.reply(author)
}
module.exports.help={
  name:"author",
  help:"Returns Bot Author Details"
}
