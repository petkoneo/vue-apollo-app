<template>
  <div>
    <!-- SIDE NAVBAR -->
    <v-navigation-drawer
      v-model="sideNav"
      app
      temporary
      fixed
    >

      <v-toolbar
        color="accent"
        dark
        flat
      >
        <v-toolbar-side-icon @click.prevent="sideNav = !sideNav" />
        <router-link
          to="/"
          tag="span"
          style="cursor: pointer"
        >
          <h1 class="title pl-3">Shareless</h1>
        </router-link>
      </v-toolbar>

      <v-divider />

      <v-list>
        <v-list-tile
          v-for="item in sideNavItems"
          :key="item.title"
          ripple
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>

        <!--Signout Button-->
        <v-list-tile
          v-if="getUser"
          @click="signoutUser"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Signout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- HORIZONTAL NAVBAR -->
    <v-toolbar
      fixed
      color="primary"
      dark
    >
      <!-- App Title -->
      <v-toolbar-side-icon @click.prevent="sideNav = !sideNav" />
      <v-toolbar-title class="hidden-xs-only">
        <router-link
          to="/"
          tag="span"
          style="cursor: pointer"
        >
          Shareless
        </router-link>
      </v-toolbar-title>

      <v-spacer />

      <v-text-field
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      />

      <v-spacer />

      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
          flat
        >
          <v-icon class="hidden-sm-only">{{ item.icon }}</v-icon>
          {{ item.title }}</v-btn>

        <!--Profile Button-->
        <v-btn
          v-if="getUser"
          flat
          to="/profile"
        >
          <v-icon class="hidden-sm-only">account_box</v-icon>
          <v-badge
            rigth
            color="blue darken-2"
          >
            <span slot="badge">1</span>
            Profile
          </v-badge>
        </v-btn>
        <!--Signout Button-->
        <v-btn
          v-if="getUser"
          flat
          @click="signoutUser"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >exit_to_app</v-icon>
          Signout
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  data () {
    return {
      sideNav: false
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    horizontalNavItems () {
      let items = [
        {
          icon: 'chat', title: 'Posts', link: '/posts'
        },
        {
          icon: 'lock_open', title: 'Sign in', link: '/signin'
        },
        {
          icon: 'create', title: 'Sign up', link: '/signup'
        }
      ]
      if (this.getUser) {
        items = [
          {
            icon: 'chat', title: 'Posts', link: '/posts'
          }
        ]
        return items
      }
      return items
    },
    sideNavItems () {
      let items = [
        {
          icon: 'chat', title: 'Posts', link: '/posts'
        },
        {
          icon: 'lock_open', title: 'Sign in', link: '/signin'
        },
        {
          icon: 'create', title: 'Sign up', link: '/signup'
        }
      ]
      if (this.getUser) {
        items = [
          {
            icon: 'chat', title: 'Posts', link: '/posts'
          },
          {
            icon: 'stars', title: 'Create Post', link: '/post/add'
          },
          {
            icon: 'account_box', title: 'Profile', link: '/profile'
          }
        ]
        return items
      }
      return items
    }
  },
  methods: {
    signoutUser () {
      this.$store.dispatch('signoutUser')
    }
  }
}
</script>

<style>

</style>