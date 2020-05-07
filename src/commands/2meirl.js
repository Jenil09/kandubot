const Discord = module.require("discord.js");
const snekfetch = require('snekfetch');
module.exports.run = async (bot, message, args) =>{
    try {
        const { body } = await snekfetch
            .get('https://www.reddit.com/r/2meirl4meirl.json?sort=top&t=week')
            .query({ limit: 800 });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .setTitle(allowed[randomnumber].data.title)
        .setDescription("Posted by: " + allowed[randomnumber].data.author)
        .setImage(allowed[randomnumber].data.url)
        .addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
        .setFooter("Memes provided by r/2meirl4meirl")
        message.channel.send(embed)
    } catch (err) {
        return console.log(err);
    }
}
module.exports.help ={
    name:"2meirl"
}
