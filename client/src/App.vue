<template>
  <v-app id="app">
    <nav-bar />
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>
        <!--Snackbar Auth-->
        <v-snackbar
          v-model="authSnackBar"
          color="success"
          bottom
          left
          :timeout="5000"
        >
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed In</h3>
          <v-btn
            dark
            flat
            @click="authSnackBar = false"
          >Close</v-btn>
        </v-snackbar>

        <!--Snackbar Auth Error-->
        <v-snackbar
          v-if="getAuthError"
          v-model="authErrorSnackBar"
          color="info"
          bottom
          left
          :timeout="5000"
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ getAuthError }}</h3>
          <v-btn
            dark
            flat
            to="/"
          >Sign in</v-btn>
        </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar
  },
  data () {
    return {
      authSnackBar: false,
      authErrorSnackBar: false
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getAuthError'])
  },
  watch: {
    getUser (newValue, oldValue) {
      // if we had no value before show snackbar
      if (oldValue === null) {
        this.authSnackBar = true
      }
    },
    getAuthError (value) {
      // if we had no value before show snackbar
      if (value !== null) {
        this.authErrorSnackBar = true
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  background-color: #eeeeee;
}

.fade-enter-active,
.fade-leave-active{
  transition-property: all;
  transition-duration: 0.3s;
}

.fade-enter-active{
  transition-delay: 0.3s;
}

.fade-enter,
.fade-leave-active{
  opacity: 0;
  transform: translateX(-2rem);
}
</style>
