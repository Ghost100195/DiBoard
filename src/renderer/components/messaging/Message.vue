<template>
    <li class="list-item">
        <v-avatar
            size="48px"
            class="grey lighten-4 message-avatar">
            <img :src="message.author.avatar" alt="avatar">
        </v-avatar>
        

        <div class="message-body">
            <div class="information-header">
                <h3>{{ message.author.name }} <span style="color: gray; font-size: 12px;">{{ message.toLocalTime() }}</span></h3>
                
                <span style="color: gray">{{ channelInformation }}</span>
            </div>
            <div class="information-body">
                <p>
                    <span v-html="message.content"></span>
                </p>
                
                
                <img v-for="(img, index) in message.attachments.images" 
                            :key="img.url + index"
                            :src="img.url"
                            :width="img.width"
                            :height="img.height"
                            >

                <iframe v-for="(vid, index) in message.attachments.videos" 
                            :key="vid.url + index"
                            width="640" height="360"
                            :src="vid.embedUrl"
                            :alt="vid"
                            frameborder="0"
                            allowfullscreen/>
            </div>

            <v-text-field 
                v-show='opened'
                dark
                
                rows="1"
                :prepend-icon='replyMessageType'
                :prepend-icon-cb="changeReplyMessageType"

                @keypress.native.enter="send"
                @click="(evt) => {evt.stopPropagation();}"             
                v-model="replyMessage"

                auto-grow

                :multi-line=true
                :textarea=true
                :clearable=true
                :autofocus=true
                :no-resize=false>
            </v-text-field>
        </div>

        
        <v-btn icon class="message-icon" @click="toggleReplyInput">
            <v-icon color="gray lighten-1" v-if="!message.replied">{{ channelTypeIcon() }}</v-icon>
            <v-icon color="green lighten-1" v-else>{{ channelTypeIcon() }}</v-icon>
        </v-btn>
    </li>
</template>

<script>
export default {
    data() {
        return {
            replyMessage: '',
            replyMessageType: 'mail_outline',
            test: ''
        };
    },    
    props: ['message', 'opened'],
    updated(){
        this.$emit('update');
    },
    created(){
        this.$emit('created');
    },
    methods: {
        send(evt){ 
            if(!evt.shiftKey){   
                this.$store.dispatch('message_reply', {message: this.message, replyMessage: this.replyMessage});
                this.replyMessage = null;

                this.$emit('close', true);
                evt.stopPropagation();
                evt.preventDefault();
            }else{
                this.replyMessage += "\n";
            }
        },
        toggleReplyInput(){
            const event = this.opened ? 'close' : 'open';
            this.$emit(event, true);
        },
        channelTypeIcon(){
            switch (this.message.channel.type){
                    case 'dm':
                        return 'message';
                    case 'text':
                        return 'forum';
                    case 'group':
                        return 'chat_bubble';
                    case 'voice':
                        return 'phone';
                default:
                    return 'report_problem';
            }
        },
        changeReplyMessageType(){
            if(this.message.channel.type === 'dm'){
                this.replyMessageType = 'mail_outline';
            }else{
                const types = ['chat_bubble', 'chat_bubble_outline', 'mail_outline'];
                let pos = types.findIndex((x) => x === this.replyMessageType);
                pos = (pos + 1) % types.length;
                this.replyMessageType = types[pos];
            }
        },
        openExternalWindow(x){
            console.log(x);
            require("shell").openExternal(x);

        }
    },
    computed: {
        channelInformation(){
            switch (this.message.channel.type){
                    case 'dm':
                        return 'Private Nachricht';
                    case 'text':
                        return `${this.message.guild.name}/${this.message.channel.name}`;
                    case 'group':
                        return 'Gruppen Nachricht';
                    case 'voice':
                        return 'phone';
                default:
                    return 'None';
            }
        }
    }
}
</script>

<style>
    .list-item{
        display: flex;
        justify-content: row;
        flex-wrap: nowrap;
        flex-direction: row;   

        background: #303030;
        margin-bottom: 10px;
        padding: 25px;
    }

    .information-header{
        display: flex;
        justify-content: space-between;
    }

    .information-body > p{
        margin-bottom: 2px;
    }

    .message-body {
        flex: 1 1;
        margin: 0px 20px;
    }

    .message-avatar {
        background: transparent;
        flex: 0 1;
    }

    .message-icon {
        flex: 0 1;
        margin: 0;
        align-self: center;
    }

    .input-group--text-field.input-group--textarea:not(.input-group--full-width) .input-group__input{
        padding: 10px;
    }

    textarea{
        resize: none;
    }


</style>
