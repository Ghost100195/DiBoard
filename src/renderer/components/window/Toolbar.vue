<template>
    <v-toolbar app fixed dark height="30px">
        <v-toolbar-side-icon @click.stop="toolbarClick"></v-toolbar-side-icon>
        <v-toolbar-title>DiBoard</v-toolbar-title>
        <v-spacer></v-spacer>
        
        <v-btn icon flat @click="minimize">
            <v-icon>fa-window-minimize</v-icon>
        </v-btn>
        
        <v-btn icon flat @click="maximize" v-show="isMaximized">
            <v-icon>fa-window-restore</v-icon>
        </v-btn>

        <v-btn icon flat @click="maximize" v-show="!isMaximized">
            <v-icon>fa-window-maximize</v-icon>
        </v-btn>

        <v-btn icon flat @click="close">
            <v-icon>fa-times</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script>
export default {
  data() {
        return {
            isMaximized: false
        };
    },
    methods: {
        toolbarClick(){
            this.$emit('sidebar-click', true);
        },
        minimize(){
            this.$electron.remote.getCurrentWindow().minimize();
        },
        maximize(){
            const window = this.$electron.remote.getCurrentWindow();
            !window.isMaximized() ?  window.maximize() :  window.unmaximize();
            this.isMaximized = window.isMaximized();
        },
        close(){
            this.$electron.remote.getCurrentWindow().close();
        },
    }
}
</script>

<style scoped>
    .spacer{
        -webkit-app-region: drag;
        height: 30px;
    }
</style>

