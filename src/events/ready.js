let basic = require('../functions/basic')
let config = require('../Config.json')
module.exports = async bot =>{
    basic.logger(`${bot.user.username} is Ready!!`)
    bot.user.setActivity(`${config.bot_status}`, { type: "WATCHING"})
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        basic.logger(link,"info")
    } catch (e) {
        basic.logger(e,"error")
    }
}