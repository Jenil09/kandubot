let config = require("../Config.json");
let basic = require("../functions/basic.js")
module.exports.run = async (bot,message,args)=>{
message.channel.send("Bot Still being Worked on")
basic.logger(`Help Command by ${message.author.username} on server ${message.guild.name}`,"info");
}
module.exports.help ={
    name:"help"
}