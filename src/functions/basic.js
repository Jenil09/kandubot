const config = require('../Config.json');
var colors = require('colors');
var Spinner = require('cli-spinner').Spinner;
const r = require('rethinkdb');
const opts = {
    errorEventName: 'error',
    logDirectory: './logs',
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};
function UUID(message){
    var id = parseInt(message.author.id,10);
    var gid = parseInt(message.guild.id,10);
    return id + gid;
}
function generateXp() {
    let min = 2;
    let max = 50;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const log = require('simple-node-logger').createRollingFileLogger(opts);
log.setLevel('info');
log.setLevel('Error');
log.setLevel('WARN');
function logger (lo,vcon){
    if(vcon == 'info'){
        log.info(`${lo}`);
        console.log(`[Info]:${lo}`.cyan);
    }
    else if(vcon == 'warn'){
        log.warn(`${lo}`);
        console.log(`[WARN]:${lo}`.yellow);
        
    }
    else if(vcon == 'error'){
        log.error(`${lo}`);
        console.log(`[ERROR]:${lo}`.red);
        process.exit();
    }
    else{
        log.info(`${lo}`)
        console.log(`[OK]:${lo}`.green);
        }
}
module.exports = {
    UUID: function(message){
        var id = parseInt(message.author.id,10);
        var gid = parseInt(message.guild.id,10);
        return id + gid;
    },
    logger:function (lo,vcon){
        if(vcon == 'info'){
            log.isInfo(`${lo}`);
            console.log(`[Info]:${lo}`.cyan);
        }
        else if(vcon == 'warn'){
            log.isInfo(`${lo}`);
            console.log(`[WARN]:${lo}`.yellow);
            
        }
        else if(vcon == 'error'){
            log.isInfo(`${lo}`);
            console.log(`[ERROR]:${lo}`.red);
            process.exit();
        }
        else{
            log.isInfo(`${lo}`)
            console.log(`[OK]:${lo}`.green);
            }
    },

    check_config: function(){
            //check if config is enabled.
             var obj = new Spinner({
            text: '%s Checking Config Settings and DataBase connection %s',
            stream: process.stderr,
            onTick: function(msg){
            this.clearLine(this.stream);
            this.stream.write(msg.blue);
            }
            })
        obj.setSpinnerString(11);
        obj.start();
        console.log("\n")
        if(config.config_enabled != 'true'){
            logger("Config is not Enabled. Please Enable it by settings config-enable to true in Config.json","error");
        }
        if(config.discod_token == ""){
            logger("No Discord Token Was Found!!","error")
        }
        else{
        logger(`Found Discord Token`,"info");
        }
        if(config.bot_prefix == ""){
        logger("No Bot Prefix found!","error")
        }
        else{
        logger(`Bot Prefix Set to:${config.bot_prefix}`,"info")
        }
        if(config.rethink_enabled != "true"){
        logger("Rethink-Database Not Enabled","error")
        }
        else{
        logger("RethinkDB Enabled","info")
        }
        if(config.rethink_host== ""){
        logger("Rethinkdb Host is empty","error")
        }
        else{
        logger(`Rethinkdb host:${config.rethink_host}`,"info")
        }
        if(config.rethink_port == ""){
        logger("Rethinkdb Port is empty","error")
        }
        else{
        logger(`Rethinkdb Port:${config.rethink_port}`,"info")
        }
        if(config.rethinkdb_dbname == ""){
        logger("Rethinkdb Database Field Empty","error")
        }
        else{
        logger(`Rethinkdb Database Name:${config.rethinkdb_dbname}`)
        }
        logger('Checking Complete')
        obj.stop();
    },
    check_database: function(){
        var connection = null;
        r.connect( {host: config.rethink_host , port: config.rethink_port}, function(err, conn) {
        if (err) throw err;
        connection = conn;
        r.dbList().contains(config.rethinkdb_dbname)
        .do(function(databaseExists) {
        return r.branch(
        databaseExists,
        { dbs_created: 0 },
        r.dbCreate(config.rethinkdb_dbname)
        );
         }).run(connection,(error,cursor)=>{
        if(error) throw error;
        if(cursor.dbs_created == 0){
            logger(`DataBase Found!`)
            return 100
        }else{
            logger(`Database Created!`)
            return 100
        }
        })
        })

        setTimeout(checktables, 5000);
        function checktables(){
        var connection = null;
        r.connect( {host: config.rethink_host , port: config.rethink_port}, function(err, conn) {
            if (err) throw err;
            connection = conn;
            let count = 0;
            const tabs = ['users','guild','xp','roast','bank'];
            tabs.forEach(name =>{
                r.db(`${config.rethinkdb_dbname}`).tableList().contains(`${name}`)
                .do(function (TableExists){
                    return r.branch(
                        TableExists,{
                            tables_created: 0
                        },r.db(`${config.rethinkdb_dbname}`).tableCreate(name)
                    );
                }).run(connection,(error,result,)=>{
                    if (error) throw error;
                    if(result.tables_created == 0){
                        logger(`Found Table:${name}`);
                    }
                    else{
                        logger(`Created Tables:${name}`);
                    }
                })
            })
            
        })
    }
    }, 
     create_account: function(message)
    {
        r.connect({host:config.rethink_host , port:config.rethink_port},(error,conn)=>{
            if(error) throw error;
            r.db(config.rethinkdb_dbname).table("bank").filter({uuid:UUID(message)}).run(conn,(error,cursor)=>{
                if (error) throw error;
                cursor.toArray((error,result)=>{
                    if (error) throw error;
                    if(result.length == 0){
                        //Create Player Profile  in bank DB
                        r.db(config.rethinkdb_dbname).table("bank").insert([{
                            uuid: UUID(message),
                            uname: message.author.username,
                            gname: message.guild.name,
                            coins: parseInt(`${config.starting_money}`,10)
                        }]).run(conn,(error,op)=>{
                            if (error) throw error;
                            logger(`Account for: ${message.author.username} in Bank `);
                        })
                    }
                })
            }) 
        })   

    },
    xp: function(message){
        r.connect({host:config.rethink_host , port:config.rethink_port},(error,conn)=>{
            if (error) throw error;
            r.db(config.rethinkdb_dbname).table("xp").filter({uuid:UUID(message)}).run(conn,(error,cursor)=>{
                if(error) throw error;
                cursor.toArray((error,result)=>{
                    if(result.length == 0){
                        r.db(config.rethinkdb_dbname).table("xp").insert([{
                            uuid:UUID(message),
                            uname:message.author.username,
                            xp: generateXp(),
                            level: '0'
                        }]).run(conn,(error,op)=>{
                            if (error) throw error;
                            logger(`Added ${message.author.username} in XP`);
                        })
                    }
                    else{
                        let cxp = parseInt(result[0].xp,10)
                        let clvl = parseInt(result[0].level,10)
                        let newxp = cxp + generateXp();
                        let nextlvl = clvl * parseInt(config.levelup);
                        if(nextlvl <= cxp){
                            message.reply(`LevelUp to :${clvl + 1}`);
                        
                            r.db(config.rethinkdb_dbname).table("xp").filter({uuid:result[0].uuid}).update({
                                xp: newxp,
                                level: `${clvl + 1}`
                            })
                            .run(conn,(err,upde)=>{
                                if (err) throw err;
                                logger(`Adding level to:${result[0].uname}`)
                            })
                        }else{
                            
                            r.db(config.rethinkdb_dbname).table("xp").filter({uuid:result[0].uuid})
                            .update({xp: newxp}).run(conn,(err,upde)=>{
                                if(err) throw err;
                                logger(`Adding ${newxp - cxp} xp to: ${result[0].uname} Total xp:${newxp} Nextlevel:${nextlvl} Require Xp:${nextlvl - newxp}`)
                            })
                        }
                    }

                })
            })
        })
    },
    update_users:(message)=>{
        r.connect({host:config.rethink_host , port:config.rethink_port},(error,conn)=>{
            if (error) throw error;
            r.db(config.rethinkdb_dbname).table("users").filter({uuid: UUID(message)}).run(conn,(error,cursor)=>{
                if (error) throw error;
                cursor.toArray(function(err,result){
                    if(err) throw err;
                    if(result.length == 0){
                        r.db(config.rethinkdb_dbname).table("users")
                        .insert([{
                            uuid: UUID(message),
                            uid: message.author.id,
                            uname: message.author.username
                        }]).run(conn,(err,op)=>{
                            if(err) throw (err)
                            logger(`Record Created for user:${message.author.username} on server ${message.guild.name}`)
                        })
                    }
                });
            })
        })
    },
    insert_guild: (data)=>{
        r.connect({host: config.rethink_host , port: config.rethink_port}, function(err, conn) {
            if (err) throw err;
            r.db(config.rethinkdb_dbname).table("guild").insert([{
                serverid: `${data[0]}`,
                servername: `${data[1]}`,
                serverowner: `${data[2]}`,
                servercreated: `${data[3]}`,
                servermembers: `${data[4]}`,
                serverregion: `${data[5]}`,
                serverstatus: "Joined"
            }]).run(conn,(error,op)=>{
                if (error) throw error;
                logger(`Joined Server ${data[1]} At ${data[3]} with Members ${data[4]}`)
            })
        })

    },
    remove_guild:(guild)=>{
        r.connect( {host: config.rethink_host , port: config.rethink_port}, function(err, conn) {
            if (err) throw err;
            r.db(config.rethinkdb_dbname).table("guild").filter({serverid:guild.id}).delete().run(conn,(error,cursor)=>{
                if (error) throw error;
                logger(`Removed Server form DataBase: ${guild.name}.`)
            })
        })
    }
    
}