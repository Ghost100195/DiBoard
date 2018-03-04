<template>
    <v-footer app :fixed="true">
        <span>&copy; 2017 || 0.0.1.alpha  </span>
        <v-spacer></v-spacer>
    
        <v-btn flat icon @click="openSetting">
            <v-icon>fa-cog</v-icon>
        </v-btn>
     
        <v-btn flat icon v-show="showRelogin()" @click="loginClick">
            <v-icon>fa-sync</v-icon> 
        </v-btn>

        <v-progress-circular button v-show="loginAttempt" indeterminate color="white"></v-progress-circular>
        <v-btn flat icon v-show="logged_in" @click="logoutClick">
            <v-icon>fa-sign-out-alt</v-icon>
        </v-btn>
    </v-footer>
</template>

<script>
    import {
        mapGetters,
        mapMutations,
        mapActions
    } from 'vuex';
    
    export default {
        computed: {
            ...mapGetters(['logged_in', 'discord_status']),
            loginAttempt() {
                return this.discord_status === 'attempting'
            }
        },
        methods: {
            ...mapMutations(['show_setting_window', 'logout']),
            ...mapActions(['discord_login']),
            loginClick() {
                // Für später - relogin mit dem alten token
                this.discord_login();
            },
    
            logoutClick() {
                this.$router.push('/');
                this.logout();
            },
    
            openSetting() {
                this.show_setting_window(true);
                this.$emit('setting-click', true);
            },
    
            showRelogin() {
                return !(this.logged_in) && this.$route.path !== "/";
            }
        }
    }
</script>

<style scoped>
</style>
