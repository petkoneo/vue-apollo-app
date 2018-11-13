<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >
    <!--Signin Title-->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <h1>Welcome back and Sing in</h1>
      </v-flex>
    </v-layout>

    <!--Error Alert-->
    <v-layout
      v-if="getError"
      row
      wrap
    ><v-flex
      xs12
      sm6
      offset-sm3
    ><form-alert :message="getError.message" />
    </v-flex>
    </v-layout>

    <!--Signin form-->
    <v-layout
      row
      wrapt
    >
      <v-flex
        cs12
        sm6
        offset-sm3
      >
        <v-card
          color="info"
          dark
        >
          <v-container>
            <v-form
              ref="form"
              v-model="isFormValid"
              lazy-validation
              @submit.prevent="signinUser"
            >

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    required
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    prepend-icon="extension"
                    label="Password"
                    type="password"
                    required
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    :disabled="!isFormValid || getLoading"
                    :loading="getLoading"
                    color="accent"
                    type="submit"
                  >
                    <span
                      slot="loader"
                      class="custom-loader"
                    >
                      <v-icon light>cached</v-icon>
                    </span>
                    Sign in </v-btn>
                  <h3>Dont have an account?
                    <router-link to="/signup">Sign Up</router-link>
                  </h3>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SignIn',
  data () {
    return {
      username: '',
      password: '',
      isFormValid: true,
      usernameRules: [
        // With this function we check if username evaluates to true
        username => !!username || 'Username is required',
        // Make sure username is less than 10 characters
        username => username.length < 10 || 'Username must be less then 10 characters long'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 7 || 'Password must be at least 7 characters long'
      ]
    }
  },
  methods: {
    signinUser () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', { username: this.username, password: this.password })
      }
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getError', 'getLoading'])
  },
  watch: {
    getUser (value) {
      // if user value  changes, redirect to homepage
      if (value) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
