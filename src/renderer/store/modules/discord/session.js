import { send, listen, login, logout,  getUserID, getGuildsAndChannels, getFriends } from '../../../util/discordClient';
import fs from 'fs';

const storedState = require('./../../../../../discord_file_save.json');
process.env.DISCORD_MODE = 'development'; // production | development

const state = {
    status: 'waiting', // waiting, attempting, access, denied
    token: storedState.token ? storedState.token : '',
    showSettingWindow: false,
    filter: {
       private: storedState.privateFilter ? storedState.privateFilter : false,
       channels: storedState.channelFilter ? storedState.channelFilter : []
    },
    messageDestructionTimeInMS: 10000,
    messageDestructionIsOn: true,
    guilds: []
};

const mutations = {
    set_discord_state (state, payload) {
        state.status = payload;
    },  
    update_token(state, payload){
        state.token = payload;
    },
    logout(state){
        state.status = 'waiting';
        state.messages = [];
        logout();
    },
    show_setting_window(state, payload){
        state.showSettingWindow = payload;
    },
    update_private_filter(state, payload){
        state.filter.private = payload;
    },
    update_channel_filter(state, payload){
        state.filter.channels = payload;
    },
    set_client_guilds(state, payload){
        state.guilds = payload;
    },
   
    set_message_delete_interval(state, payload){
        state.messageDestructionIsOn = payload;
    },
    set_message_delete_interval_in_ms(state, payload){
        state.messageDestructionTimeInMS = payload;
    }
};

const actions = {
    discord_login(state) {
        const { commit, dispatch, getters } = state;
        commit('set_discord_state', 'attempting');
        
        if(process.env.DISCORD_MODE === 'development'){ 
            commit('set_discord_state', 'access');
            const msg = require('../../../../../static/testData.json')
            for(let i = 0; i < msg.length; i++){
                setTimeout(function(){
                    dispatch('message', msg[i]);
                }, i *1500);
            }
        }else{
            login(state.getters.token, 
            (token) => {
                console.log('Discord Login - Success!');
                commit('set_discord_state', 'access');
                dispatch('fetch_client_guilds');
                init(getters, dispatch);
            },
            () => {
                console.log(err);
                commit('set_discord_state', 'denied');
            });
        }
    },
    set_message_destruction(store, payload){
        store.commit('set_message_delete_interval', payload);
        store.commit('update_message_destruction', payload ? store.getters.messageDestructionTimeInMS : 0);
    },
    update_message_destruction_in_ms(store, payload){
        store.commit('set_message_delete_interval_in_ms', payload);
        store.commit('update_message_destruction', payload);
    },
    fetch_client_guilds({ commit }, payload){
        commit('set_client_guilds', getGuildsAndChannels());
    },


    save_discord_settings({ getters }){  
        const toSave = {
            autoLogin: getters.autoLogin,
            token: getters.token,
            privateFilter: getters.filter.private,
            channelFilter: getters.filter.channels
        };
        
        fs.writeFile('discord_file_save.json', JSON.stringify(toSave, null, 2), (err) => {
            if(err) {
                console.log(err);
            }else{
                console.log('Discord Setting saved!');
            }
        });
    }
};

const getters = {
    discord_status: (state) => {
        return state.status;
    },
    logged_in: (state) => {
        return state.status === 'access';
    },
    token: (state) => {
        return state.token;
    },

    privateFilter: (state) => {
        return state.filter.private;
    },
    channelFilter: (state) => {
        return state.filter.channels;
    },

    guilds: (state) => {
        return state.guilds;
    },


    isSettingWindowOpen: (state) => {
        return state.showSettingWindow;
    },


    messageDestructionTimeInSeconds: (state) => {
        return state.messageDestructionTimeInMS/1000;
    },
    messageDestructionIsOn: (state) => {
        return state.messageDestructionIsOn;
    }
};

function init(getters, dispatch){
    listen('message', (message) => {
        dispatch('message', message);
    });
}

export default {
  state,
  mutations,
  actions,
  getters
}
