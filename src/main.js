var fsa = require('fs');
var dir = './logs';
if (!fsa.existsSync(dir)){
    console.log("Creating logs folder")
    fsa.mkdirSync(dir);
}

const config = require('./Config.json');
const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const basic = require('./functions/basic.js');
basic.check_config();
basic.check_database();
require('./util/eventloader')(bot); 
//const r = require('rethinkdbdash')({servers:[{host:config.rethink_host,port:config.rethink_port}]})
const r = require('rethinkdb');
//checks Values in Config.json

//Checks Connection with Database and 
//Create Database and Tables if not Found

const fs = require("fs");
bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
    if (err) log.error(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        basic.logger(`No Commands Loaded`,"warn");
        return;
    }
    basic.logger(`Loading ${jsfiles.length} Command!`,"info");
    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        basic.logger(`${i+1}: ${f} Loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

let prefix = config.bot_prefix;
bot.on("guildCreate", guild => {
    console.log(guild.name);
    let data =[`${guild.id}`,`${guild.name}`,`${guild.owner}`,`${guild.joinedAt}`,`${guild.memberCount}`,`${guild.region}`];
    basic.insert_guild(data);
    });
bot.on("guildDelete", guild => {
    basic.remove_guild(guild);
    });
bot.login(config.discod_token);

