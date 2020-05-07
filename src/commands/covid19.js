let config = require("../Config.json");
let Discord = require("discord.js")
let basic = require("../functions/basic.js")
const fetch = require('node-fetch');
module.exports.run = async (bot,message,args)=>{
   let  api ="https://covid19.mathdro.id/api";
   function num(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
   
    if(!args[0]){
        fetch(api).then(response =>{
            if(response.ok){
                response.json().then((data)=>{
                    let msg = message.channel.send(`Fetching Data......`).then((msg)=>{
                        let embed = new Discord.MessageEmbed();
                        embed.setColor([255, 0, 0])
                        embed.setTitle(`SARS-COV 2 Global Numbers`)
                        embed.addField("**Infected:**",`${num(data.confirmed.value)}`)
                        embed.addField("**Recovered:**",`${num(data.recovered.value)}`)
                        embed.addField("**Deaths:**",`${num(data.deaths.value)}`)
                        ts = new Date(data.lastUpdate);
                        embed.setFooter(`Last Updated: ${ts.toDateString()}`)
                        msg.edit(embed);
                    })
                })
            }
        })
    }
    else{
        let url=`https://covid19.mathdro.id/api/countries/${args[0]}`;
        fetch(url).then(response=>{
            if(response.ok){
                response.json().then((data)=>{
                    let msg = message.channel.send(`Fetching Data......`).then((msg)=>{
                    let embed = new Discord.MessageEmbed();
                    embed.setColor([255, 0, 0])
                    embed.setTitle(`Numbers in ${args[0]}`)
                    embed.addField("**Infected:**",`${num(data.confirmed.value)}`)
                    embed.addField("**Recovered:**",`${num(data.recovered.value)}`)
                    embed.addField("**Deaths:**",`${num(data.deaths.value)}`)
                    ts = new Date(data.lastUpdate);
                    embed.setFooter(`Last Updated: ${ts.toDateString()}`)
                    msg.edit(embed);
                    })
                })
            }
        })
    }

}
    module.exports.help ={
    name:"covid19"
}