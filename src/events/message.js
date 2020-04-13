const config = require('../Config.json')
const basic = require('../functions/basic')
module.exports = async message =>{
    const bot = message.client;
    if (message.author.bot) return;
    basic.update_users(message)
    basic.xp(message)
    basic.create_account(message)
        let messageArray = message.content.split(" ");
        let commande = messageArray[0];
        if (!commande.startsWith(config.bot_prefix)) return;
    if (message.channel.type === "dm") {
        switch (messageArray[0]) {
            case `${config.bot_prefix}invitelink`:
                let link = await bot.generateInvite(["ADMINISTRATOR"]);
                message.author.send(`${bot.user.username}'s Invite Link: ${link}`);
                break;
        }
    }
    
    if(message.author.bot) return;
    const args = message.content.split(` `);
    const command = args.shift().slice(config.bot_prefix.length)
    try{
        let cmd = bot.commands.get(command);
        if (cmd) cmd.run(bot, message, args);
    }
    catch(err){
        basic.logger(` ${err.stack}`,"warn")
    }
}