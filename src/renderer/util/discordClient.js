import Discord from 'discord.js'; 
const options = {
    disabledEvents: ['TYPING_START']
};
const client = new Discord.Client(options);


client.on('disconnect', (e) => {
    console.log('Discord Disconnect');
});

export function getUserById(userID){
    return client.users.get(userID);
}

export function send(content, message){
    if(message.channel.type === "dm"){
        getUserById(message.author.id).send(content);
    }else{
        getChannelByID(message.guild.id, message.channel.id).send(content);
    }
}

export function listen(type, callback){
    client.on(type, callback);
}

export function login(token, success, fail){
    client.login(token).then(success).catch(fail);
}

export function getUserID(){
    return client.user.id;
}

export function getChannelByID(guildID, channelID){
    return client.guilds.get(guildID).channels.get(channelID);
}

export function getFriends(){
    return Array.from(client.user.friends.values());
}

export function getGuildMembers(guild){
    return Array.from(client.guilds.get(guild).members.values());
}

export function logout(){
    client.destroy();
}

export function getGuildEmojis(guildID){
    return client.guilds.get(guildID).emojis;
}

export function getClientEmojis(){
    return client.emojis;
}

export function getGuildsAndChannels(){
    /* [{
            id: ''
            name: '',
            channels: [
                {channelname, channelid}
            ]
        }]
        */

    const result =  client.guilds.map((guild) => {
        return {
            avatar: guild.iconURL,
            id: guild.id,
            name: guild.name, 
            channels: guild.channels.filter((channel) => channel.type !== 'voice' &&  channel.type !== null).map((channel) => {
                return {
                    id: channel.id,
                    name: channel.name
                }
            })
        };
    });
    return result;
}

export default client; 


