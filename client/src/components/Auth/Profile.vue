<template>
  <v-container text-xs-center>
    <v-flex
      sm6
      offset-sm3
    >
      <v-card
        class="white--text"
        color="secondary"
      >
        <v-layout>
          <v-flex xs5>
            <v-card-media
              height="125px"
              contain
              :src="getUser.avatar"
            />
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ getUser.username }}</div>
                <div>Joined {{ getUser.joinDate }}</div>
                <div class="hidden-xs-only font-weight-thin">{{ getUser.favorites.length }} Favorites</div>
                <div class="hidden-xs-only font-weight-thin">2 Post Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!--Post Favorites by user-->
    <v-container v-if="!getUserFavorites.length">
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <h1>You have no favorites. Go and get some.</h1>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container
      v-else
      class="mt-3"
    >
      <v-flex xs12>
        <h2 class="font-weight-light">Favorited <span class="font-weight-regular">{{ getUserFavorites.length }}</span></h2>
      </v-flex>
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="favorite in getUserFavorites"
          :key="favorite._id"
          xs12
          sm6
        >
          <v-card
            class="mt-3 m1 mr-2"
            hover
            :to="`posts/${favorite._id}`"
          >
            <v-img
              height="30vh"
              :src="favorite.imageUrl"
              :alt="favorite.title"
            />
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['getUser', 'getUserFavorites'])
  }
}
</script>getrequestDataMock

<style>

</style>
