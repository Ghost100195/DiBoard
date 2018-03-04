<template>
  <div id="app" v-resize="resize">
    <v-app dark>
      <side-navigation :toggle="isSideNavigationbarOpen"></side-navigation>
  
      <toolbar @sidebar-click="isSideNavigationbarOpen = !isSideNavigationbarOpen"></toolbar>
  
      <v-content>
        <router-view :footerTop="footerTopPosition"></router-view>
      </v-content>
  
      <foot ref="windowFooter"></foot>
    </v-app>
  </div>
</template>

<script>
  import SideNavigation from './components/window/SideNavigation';
  import Toolbar from './components/window/Toolbar';
  import Foot from './components/window/Footer';
  
  export default {
    name: 'dipanel',
    data() {
      return {
        isSideNavigationbarOpen: false,
        footerTopPosition: 0
      };
    },
    methods: {
      resize() {
        this.footerTopPosition = this.$refs.windowFooter.$el.getBoundingClientRect().top;
      }
    },
    mounted() {
      this.footerTopPosition = this.$refs.windowFooter.$el.getBoundingClientRect().top;
    },
    components: {
      Toolbar,
      Foot,
      SideNavigation
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  
  /* Global CSS */
  
  html {
    overflow: hidden;
  }
  
  .content__wrap {
    overflow-y: auto;
  }
  
  .application.theme--dark {
    background: #424242;
  }
  
   ::-webkit-scrollbar {
    width: 0em;
  }
  
   ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 1);
  }
  
   ::-webkit-scrollbar-thumb {
    background-color: white;
    outline: 1px solid white;
  }
</style>
