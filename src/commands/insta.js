let config = require("../Config.json");
let basic = require("../functions/basic.js")
const Discord = module.require("discord.js");
const {stripIndents } = require("common-tags");
const fetch = require('node-fetch');
module.exports.run = async (bot,message,args)=>{
    const name = args[0];
    if(!name){
        return message.reply("Maybe it's usefull to actually search for someone...! BITCH")
    }
    basic.logger(`Instagram Search for ${name} by ${message.author.username} on ${message.guild.name}`)
    const url = `https://instagram.com/${name}/?__a=1`;
    //const res = await fetch(url).then(url => url.json()).response.json.catch();
     fetch(`https://instagram.com/${name}/?__a=1`)
    .then(response => {
      if(response.ok){
        response.json().then((data) => {
          const account = data.graphql.user;
          const embed = new Discord.MessageEmbed();
          embed.setColor("RANDOM");
          embed.setTitle(account.full_name);
          embed.setURL(`https://instagram.com/${name}/?__a=1`);
          embed.setThumbnail(account.profile_pic_url_hd);
          embed.addField("Instagram Profile Information", stripIndents`**- Username:** ${account.username}
          **- Full Name: **${account.full_name}
          **- Biography: **${account.biography.length == 0 ? "none": account.biography}
          **- Posts: **${account.edge_owner_to_timeline_media.count}
          **- Followers: **${account.edge_followed_by.count}
          **- Following: **${account.edge_follow.count}
          **- Private Account: **${account.is_private ? "yes 🔒":"No 🔓"}`);
          message.channel.send(embed);
          basic.logger(`Instagram Search for ${account.username} By User:${message.author.username} on Server:${message.guild.name}`)
        });  
      }else{
        message.reply(`I couldn't find that Account with username ${name}, BITCH 😞`)
        throw `I couldn't find that Account with username ${name}, BITCH 😞`
        return;
      }
    }).
    catch(error => {
        return;
    });


}
module.exports.help ={
    name:"insta"
}