<template>
    <v-container fluid fill-height>
        <v-layout justify-center align-center>
            <v-flex xs4>
                <v-subheader class="grey--text text--lighten-1">Ihr Benutzertoken</v-subheader>
            </v-flex>
            <v-flex xs7>
                <v-text-field   
                    dark 
                    :label="loginNote" 
                    v-model="token" 
                    @keyup.enter="login" 
                    :rules="validateToken">
                </v-text-field>
            </v-flex>
            <v-flex xs1>
                <v-progress-circular 
                    v-show="loginAttempt" 
                    indeterminate 
                    color="white">
                </v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {
        mapActions,
        mapMutations
    } from 'vuex';
    
    export default {
        name: 'login-page',
        data() {
            return {
                valid: true,
                validateToken: [
                    (v) => {
                        if (!v) {
                            this.valid = false;
                            return 'Token wird benötigt'
                        }
                        this.valid = true;
                        return true;
                    }
                ],
                loginAttempt: false
            };
        },
        methods: {
            ...mapActions(['discord_login']),
            ...mapMutations(['update_token']),
            login() {
                if (this.valid) {
                    this.discord_login();
                }
            }
        },
        computed: {
            loginNote() {
                const status = this.$store.getters.discord_status;
                let note = 'Token ...';
    
                if (status === 'attempting') {
                    this.loginAttempt = true;
                }
    
                if (status === 'access') {
                    this.$router.push('./main');
                }
    
                if (status === 'denied') {
                    note = 'Bitte geben sie ein gültiges Token ein!';
                }
    
                if (status === 'waiting') {
                    note = 'Token ...';
                }
    
                return note;
            },
            token: {
                get() {
                    return this.$store.getters.token;
                },
                set(value) {
                    this.update_token(value);
                }
            }
        }
    }
</script>


<style scoped>
    
</style>