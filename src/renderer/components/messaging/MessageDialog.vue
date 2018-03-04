<template>
    <v-dialog   v-model="isSettingWindowOpen" 
                fullscreen transition="dialog-bottom-transition" 
                :overlay="false"           
                scrollable>
        <v-card dark  ref="dialog">

            <v-toolbar dark ref="toolbar">
                <v-btn icon @click.native="closeDialog(false)" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Einstellungen</v-toolbar-title>
                <v-spacer></v-spacer>
                
                <v-toolbar-items>
                    <v-btn dark flat @click.native="closeDialog(true)">Speichern</v-btn>
                </v-toolbar-items>
            </v-toolbar>
      
        
            <v-card-text style="max-height: 300px;" ref="body">
                <v-container fluid text-xs-center>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-subheader>Token</v-subheader>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field disabled dark :value="token.replace(token.substr(4, token.length - 7), (x) => '*'.repeat(x.length))"></v-text-field>
                        </v-flex>
                
                        <v-flex xs12 style="border-top: 1px solid gray">
                            <v-subheader>Nachrichten</v-subheader>
                        </v-flex>
                        <v-layout row wrap>
                            
                            <v-flex xs11 offset-xs1>
                                <v-subheader>Löschen von Nachrichten</v-subheader>
                            </v-flex>

                            <v-flex xs4 offset-xs2>
                                <v-subheader>Automatisches Löschen</v-subheader>
                            </v-flex>
                            <v-flex xs6>
                                <v-checkbox
                                    dark
                                    v-model="messageDestructionIsOn"
                                ></v-checkbox>
                            </v-flex>

                            <v-flex xs4 offset-xs2>
                                <v-subheader>Dauer bis zum Löschen</v-subheader>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field
                                    dark
                                    :value="messageDestructionTimeInSeconds"
                                    @blur="updateMessageDeletIntervalMS"
                                    suffix="Sekunden"
                                    :disabled="!messageDestructionIsOn"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs11 offset-xs1>
                                <v-subheader>Zeige Nachrichten von</v-subheader>
                            </v-flex>


                            <v-flex xs4 offset-xs2>
                                <v-subheader>Freunde</v-subheader>
                            </v-flex>
                            <v-flex xs6>
                                    <v-checkbox
                                dark
                                v-model="allowPrivateMessages"
                            ></v-checkbox>
                            </v-flex>

                            <v-flex xs10 offset-xs2>
                                <v-subheader>Guild</v-subheader>
                            </v-flex>
                            <v-flex xs9 offset-xs3>
                                <ul>
                                    <v-layout row wrap>
                                        
                                         <template v-for="(guild, index) in guilds">
                                            <v-flex xs5  :key="index">
                                                <v-subheader>{{ guild.name }}</v-subheader>  
                                            </v-flex>

                                            <v-flex xs7 :key="guild.id">
                                                <v-select
                                                    label="Select"
                                                    item-text="name"
                                                    item-value="id"
                                                    :items="guild.channels"
                                                    v-model="allowChannelMessages"
                                                    multiple
                                                    chips
                                                ></v-select>
                                            </v-flex>
                                        </template>

                                    </v-layout>
                                </ul>
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            dialog: false,
        };
    },
    computed: {
        ...mapGetters(['isSettingWindowOpen', 
                        'token',
                        'guilds', 
                        'messageDestructionTimeInSeconds']),
        enableAutoLogin: {
            get(){
                return this.$store.getters.autoLogin;
            },
            set(value){
                this.enable_auto_login(value);
            }
        },
        allowPrivateMessages: {
            get(){
                return this.$store.getters.privateFilter;
            },
            set(value){
                this.update_private_filter(value);
            }
        },
        allowChannelMessages: {
            get(){
                return this.$store.getters.channelFilter;
            },
            set(value){
                this.update_channel_filter(value);
            }
        },
        messageDestructionIsOn: {
             get(){
                return this.$store.getters.messageDestructionIsOn;
            },
            set(value){
                this.set_message_destruction(value);
            }
        }
    },
    methods: {
        ...mapMutations(['update_channel_filter', 'update_private_filter','show_setting_window']),
        ...mapActions(['save_discord_settings', 'update_message_destruction_in_ms', 'set_message_destruction']),
        closeDialog(save){
            this.show_setting_window(false);
            if(save){
                this.save_discord_settings();
            }
        },
        calcHeight(){
            const height =  (this.$refs.dialog.$el.getBoundingClientRect().height - ( this.$refs.toolbar.$el.getBoundingClientRect().height));
            this.$refs.body.style.maxHeight = height + 'px' ;
        },
        updateMessageDeletIntervalMS(evt){
            this.update_message_destruction_in_ms(evt.target.value * 1000);
        }
    },
    updated(){
        this.calcHeight();
    }
}
</script>

<style scoped>
    dialog.dialog--active.dialog--fullscreen{
        background: green;
    }

    ::-webkit-scrollbar {
        width: 0.75em;
    }
    
    ::-webkit-scrollbar-track {
        background: #303030;
        
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: gray;
        outline: 1px solid gray;
    }
</style>
