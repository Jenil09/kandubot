let config = require("../Config.json");
let basic = require("../functions/basic.js")
module.exports.run = async (bot,message,args)=>{
           // We want to check if the argument is a number
           if (isNaN(args[0])) {
            // Sends a message to the channel.
            message.channel.send('Please use a number as your arguments. \n Usage: ' + 'k1' + 'purge <amount>'); //\n means new line.
            // Cancels out of the script, so the rest doesn't run.
            return;
        }
        if(args[0] >= 30) return message.channel.send("Please Purge less then 30 Messages at Once");

            message.channel.messages.fetch({
                limit: args[0] // Fetch last 50 messages.
            }).then((messages) => { // Resolve promise
                messages.forEach((msg) => { // forEach on message 
                basic.logger(`Message:${msg}`,"info")
                msg.delete(); // Delete each message
            })
            basic.logger(`${args[0]} Message Deleted From Server: ${message.guild.name}`)
        });
}
module.exports.help ={
    name:"purge"
}