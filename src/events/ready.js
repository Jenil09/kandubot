let basic = require('../functions/basic')
module.exports = async bot =>{
    basic.logger(`${bot.user.username} is Ready!!`)
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        basic.logger(link,"info")
    } catch (e) {
        basic.logger(e,"error")
    }
}