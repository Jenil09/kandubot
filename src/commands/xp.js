let config = require("../Config.json");
let basic = require("../functions/basic.js")
let r = require("rethinkdb")
let Discord = module.require("discord.js")
module.exports.run = async (bot,message,args)=>{
    let target = message.mentions.users.first() || message.author;
    if (!target) return message.reply("Mention Someone First You Dumb Fuck!")
    r.connect({host:config.rethink_host , port:config.rethink_port},(error,conn)=>{
        if (error) throw error;
        r.db(config.rethinkdb_dbname).table("xp").filter({uuid:basic.UUID(message)}).run(conn,(error,cursor)=>{
        if (error) basic.logger(error,"error");
        cursor.toArray((error,result)=>{
            if (error) basic.logger(error,"error");
            if(result[0] == 0){
                message.channel.send("User not Found In Database");
                return;
            }
            else{
                message.channel.send(`**${result[0].uname}** has **XP:${result[0].xp}** and on **level:${result[0].level}**`)
            }
        })   
    })
})

}
module.exports.help ={
    name:"xp"
}