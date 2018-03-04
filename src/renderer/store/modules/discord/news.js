import Message from '../../data/discord/message';
import { send, getUserID } from '../../../util/discordClient';

let messages = [];

const state = {
  messages,
  interval: null,
}

const mutations = {
    new_message(state, payload){
        state.messages = state.messages.length < 200 ? [...state.messages, payload] : [...state.messages.splice(1 , state.messages.length), payload];
    },
    delete_message(state, payload){
        state.messages = state.messages.filter((msg) => {
            return !msg.equal(paylad);
        });
    },
    delete_message_by_id(state, payload){
        state.messages = state.messages.filter((msg) => {
            return msg.id !== payload;
        });
    },
    update_message_destruction(state, payload){
        state.messages.forEach((msg) => {
            msg.updateDestructionTime(payload);
        });
    }
}

const actions = {
    message({ commit, dispatch, getters }, payload){
        const time = getters.messageDestructionIsOn ? getters.messageDestructionTimeInMS : 0;
        
        if(process.env.DISCORD_MODE === "development"){
            const msg = new Message(payload,time);
            msg.destroy = (id) => {commit('delete_message_by_id', id)};
            commit('new_message', msg);
        }else if((filterByChannel(getters.channelFilter, payload.channel.id)  
                || filterByPrivateMessages(getters.privateFilter, payload.channel.type)) &&
                payload.author.id !== getUserID()){

            const msg = new Message(payload,time);
            msg.destroy = (id) => {commit('delete_message_by_id', id)};
            commit('new_message', msg);
        }
    },

    message_reply({commit}, payload){
        const { message, replyMessage } = payload;
        
        if(process.env.DISCORD_MODE === 'production'){
            send(replyMessage, message);
        }
        commit('delete_message', message);
    }
}

const getters = {
  messages: (state) => {
    return state.messages;
  },
  message_by_id: (state) => (id) => {
    const res = state.messages.filter((msg) => msg.id === id);
    return res[0] ? res[0] : undefined;
  }
}

function filterByChannel(allowedChannels, messageChannelID){
  return allowedChannels && allowedChannels.indexOf(messageChannelID) !== -1
}

function filterByPrivateMessages(privateMessagesAllowed, messageType){
  return privateMessagesAllowed && messageType === "dm";
}

export default {
  state,
  mutations,
  actions,
  getters
}
