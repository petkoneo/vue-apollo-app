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
        v-model="searchTerm"
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
        @input="searchPosts"
      />

      <!--Search results card-->
      <v-card
        v-if="getSearchResults.length"
        id="search__card"
        dark
      >
        <v-list>
          <v-list-tile
            v-for="result in getSearchResults"
            :key="result._id"
            @click="goToSearchResult(result._id)"
          >
            <v-list-tile-title>{{ result.title }}
              <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
            </v-list-tile-title>

            <!--Show Icon if favorited by user-->
            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon color="red">favorite</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

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
            :class="{ 'bounce': badgeAnimated }"
          >
            <span
              v-if="getUserFavorites.length"
              slot="badge"
            >{{ getUserFavorites.length }}</span>
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
      sideNav: false,
      badgeAnimated: false,
      searchTerm: ''
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getUserFavorites', 'getSearchResults']),
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
  watch: {
    getUserFavorites (value) {
      // if the value changes we animate
      if (value) {
        this.badgeAnimated = true
        setTimeout(() => (this.badgeAnimated = false), 1000)
      }
    }
  },
  methods: {
    signoutUser () {
      this.$store.dispatch('signoutUser')
    },
    searchPosts () {
      this.$store.dispatch('searchPosts', {
        searchTerm: this.searchTerm
      })
    },
    goToSearchResult (resultId) {
      // Clear search results
      this.searchTerm = ''
      // Go to desired result
      this.$router.push(`/posts/${resultId}`)
      // creat search results
      this.$store.commit('CLEAR_SEARCH_RESULTS')
    },
    formatDescription (desc) {
      return desc.length > 20 ? `${desc.slice(0, 20)}...` : desc
    },
    checkIfUserFavorite (resultId) {
      return this.getUserFavorites && this.getUserFavorites.some(fav => fav._id === resultId)
    }
  }
}
</script>

<style>
/*user favorite animation*/
  .bounce {
    animation: bounce 1s both;
  }

  @keyframes bounce {
    0%, 20%, 56%, 80%, 100% {
      transform: translate3d(0, 0, 0)
    }
    40%, 43% {
      transform: translate3d(0, -10px, 0)
    }
    70% {
      transform: translate3d(0, -10px, 0);
    }
    90%{
      transform: translate3d(0, -4px, 0);
    }
  }

  /*Search results Card*/

  #search__card {
    position: absolute;
    width: 100vw;
    z-index: 8;
    top:100%;
    left:0
  }
</style>
