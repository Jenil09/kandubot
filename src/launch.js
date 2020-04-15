const config = require('./Config.json')
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./main.js', { token: `${config.discod_token}` });
manager.spawn();
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));