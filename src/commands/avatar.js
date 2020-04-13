const Discord = module.require("discord.js");
module.exports.run = async (bot , message , args)=>{
 let gen = await message.channel.send("Generating Your Avatar...")
 await message.reply(message.author.displayAvatarURL());

 gen.delete();
}
module.exports.help={
  name:"avatar",
  help:"Sends Your Display Avatar"
}
