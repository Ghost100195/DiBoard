<template>
  <v-container fluid fill-height>
    <v-layout column>
        <v-flex xs12>
            <scroll-window 
                scrollTime="600"
                scrollStepSize="10"
                :footerTop="footerTop" 
                ref="scrollWindow"
                scrollDownButtonText="Scroll Down"
                headerText="News"
                >
                <ul>    
                    <transition-group
                        name="slide">
                    <message v-for="(msg) in messages" 
                            :key="msg.id" 
                            :message="msg"
                            :opened="msg === choosenMessage"
                            @open="messageToggle(msg, true)"
                            @close="messageToggle(msg, false)"
                            @created="messageCreated">
                        </message>
                    </transition-group>  
                </ul>
            </scroll-window>  
        </v-flex>
    </v-layout>

    <message-dialog></message-dialog>
    
 </v-container>
    
</template>

<script>
import { mapGetters } from 'vuex';
import Message from './Message';
import MessageDialog from './MessageDialog';
import ScrollWindow from '../component/ScrollWindow';

  export default {
    name: 'main-page',
      data() {
        return {
          choosenMessage: null,
          window: 'main-window',
          newUnseenMessage: false,
        };
      },
      props: ['footerTop'],
      methods: {
        openSetting() {
          this.window = this.window === 'setting-window'? 'main-window' : 'setting-window';
        },
        messageToggle(msg, bool){
          this.choosenMessage = bool ? msg : null;
        },
        messageCreated(){
            this.$refs.scrollWindow.$emit('scrollDown')
        },
        testSave(){
          this.$store.dispatch('save_testData');
        },
      },
      computed: {
        ...mapGetters(['messages'])
      },
      components: {Message, MessageDialog, ScrollWindow}
  }
</script>

<style scoped>
  ul{
    list-style: none;
    margin: 10px;
    padding: 10px;
    background: #424242;

    overflow-x: hidden;
  }

  .slide-enter{
  }

  .slide-enter-active{

  }

  .slide-leave{
    
  } 

  .slide-leave-active{
    animation: fade-out 1s ease-out forwards;
    opacity: 0;
    position: absolute;

  }

   .slide-move{
    transition: transform 0.75s;
  }


  @keyframes slide-in {
    from {
      transform: translate(100px, 0);
    }
    to{
      transform: translate(0, 0);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 0;
    }
    to{
      opacity: 0;
    }
  }
</style>
