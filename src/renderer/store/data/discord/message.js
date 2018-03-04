export default class Message{
    constructor(discordMessage, selfDestructionTime){
        const {createdAt, id, cleanContent } = discordMessage;
        this.platform = 'discord';
        this.time = createdAt;
        this.lastUpdateTime = createdAt;
        this.id = id;
        this.content = cleanContent,
        this._rawContent = cleanContent,
        this.attachments = {
            videos: [],
            images: []
        };
        this.setImages(discordMessage.attachments);
        this.setAuthor(discordMessage.author);
        this.setChannel(discordMessage.channel);
        this.setGuild(discordMessage.channel);

        this._markLinks();
        this._removeCustomEmojis(); // Spaeter so aendern das diese auch angezeigt werden
        this._findURLs();

        this.startSelfDestruction(selfDestructionTime);
    }

    equal(msg){
        return (
            this.id === msg.id && this.platform === msg.platform
        );
    }


    isExpired(expireTime, time){

    }
  
    /* --------------------------------  Destruction Content   ------------------------------------- */
    updateDestructionTime(newTimeInMS){
        if(this.selfDestruction){
            clearInterval(this.selfDestruction);
        }
        this.startSelfDestruction(newTimeInMS);
    }
    
    startSelfDestruction(timeInMS){
        // Die Zeit sollte groeßer als 1Sekunde sein
        if(timeInMS && timeInMS > 1000){
            this.selfDestruction = setTimeout(() => {
                this.destroy(this.id);
            }, timeInMS);
        }
    }

    destroy(){
        console.log('Bitte ueberschrieben, damit Message weiß wie es sich aus dem Vuex store zu loeschen hat');
    }

    /* --------------------------------  Output Content   ------------------------------------- */
    toLocalTime(){
        const date = process.env.DISCORD_MODE === 'development' ? new Date() : this.time;
        return date.toLocaleTimeString().match(/\d+:\d+/)[0]
    }

    /* --------------------------------  Content Bearbeitung   ------------------------------------- */
    _removeCustomEmojis(){
        const customEmoijRegExp = /<:\w+:\d+>/g;
        this.content = this.content.replace(customEmoijRegExp, '');
    }

    _findURLs(){
        // youtube URL
        const isYoutubeURLRegExp = /(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/\S+/;
        let youtubeURL = this._rawContent.match(isYoutubeURLRegExp);
        // youtube URL vorhanden ?
        if(youtubeURL) this.setVideo(youtubeURL[0]);
    }

    _markLinks(){
        this.content = this.content.replace(/((https|http)\:\/\/|www\.)\S+/, (x) => {
            return `<span style="text-decoration: underline;">${x}</span>`
        });
    }

    /* --------------------------------  Getter   ------------------------------------- */
    getAuthorAsObject(){
        return {
            id: this.author.id,
            name: this.author.name,
            avatar: this.author.avater,
            platform: 'discord'
        }
    }


    /* --------------------------------  Setter   ------------------------------------- */
    setImages(attachments){
        if(attachments && attachments.length){
            const imgs = attachments.map((img) => { 
                return { url: img.url, width: img.width, height: img.height } 
            });
            this.attachments.images.concat(imgs);
        }
    }

    setVideo(videoURL){
        // Pruefe ob es sich wirklich um ein Youtube-Link handelt.
        // trage die Platform ein um späteren Support fuer andere Platformen zu unterstuetzen
        const videoIdRegExp = /v=\S*?(?=(&|\s|$))/;
        let id = videoURL.match(videoIdRegExp);
        if(id) id = id[0].replace('v=', '');
        let url = videoURL;
        url = url.replace(/watch\?\S+/, `embed/${id}`);    
        // switch /watch gegen /embed aus damit die youtube embeded videos angesprochen werden

        const video = {url: videoURL, embedUrl: url, isPlaying: false, platform: 'unknown'};

        this.attachments.videos.push(video);
    }
    
    setChannel(channel){
        this.channel = {
            type: channel.type,
            id: channel.id,
            name: channel.name ? channel.name : ''
        };
    }

    setAuthor(author){
        this.author = {
            id: author.id,
            name: author.username,
            avatar: author.avatarURL
        };
    }

    setGuild(channel){
        this.guild = {
            name: channel.guild ? channel.guild.name : null,
            id: channel.guild ? channel.guild.id : null
        };
    }
}