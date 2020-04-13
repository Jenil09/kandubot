const Discord = module.require("discord.js")
const config = require("../Config.json")
const r = require("rethinkdb")
const basic = require("../functions/basic.js")
function UUID(message){
    var id = parseInt(message.author.id,10);
    var gid = parseInt(message.guild.id,10);
    return id + gid;
}
module.exports.run = async (bot, message, args)=>{
    let user = message.mentions.users.first() || message.author.id;
    if(!user === message.author.id) user = user.id;
    r.connect({host:config.rethink_host , port:config.rethink_port},(error,conn)=>{
        if (error) throw error;
        r.db(config.rethinkdb_dbname).table('bank').filter({uuid:UUID(message)}).run(conn,(error,cursor)=>{
            if(error) throw error;
            cursor.toArray((error,result)=>{
                if(result.length == 0) return message.channel.send(`Account Not Found`);
                var balance = new Discord.MessageEmbed;
                balance.setTitle(`${config.bot_name}`);
                balance.addField("User:",`**${result[0].uname}**`);
                balance.addField("Server Name",`**${result[0].gname}**`);
                balance.addField("Onions:",`**${result[0].coins}**`);
                message.channel.send(balance);
            })
        })
    })
}

module.exports.help ={
    name:"balance",
    help:"Displays Your Bank Balance"
}
