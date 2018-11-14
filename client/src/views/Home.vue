<template>
  <v-container
    text-xs-center
  >
    <v-layout row>
      <v-dialog
        v-model="getLoading"
        persistent
        fullscreen
      >
        <v-container fill-height>
          <v-layout
            row
            justify-center
            align-center
          >
            <v-progress-circular
              indeterminate
              :size="70"
              :width="7"
              color="primary"
            />
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
    <v-flex xs12>
      <v-carousel
        v-if="!getLoading && getPosts.length > 0"
        v-bind="{ 'cycle': true }"
        interval="3000"
      >
        <v-carousel-item
          v-for="(post, id) in getPosts"
          :key="id"
          :src="post.imageUrl"
          @click.native="goToPost(post._id)"
        >
          <h1 id="carousel-title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

  name: 'Home',
  computed: {
    ...mapGetters(['getPosts', 'getLoading'])
  },
  created () {
    this.getCarouselPosts()
  },
  methods: {
    getCarouselPosts () {
      // handle posts data for carousel
      this.$store.dispatch('getPosts')
    },
    goToPost (id) {
      this.$router.push(`/posts/${id}`)
    }
  }
}
</script>

<style>
  #carousel-title{
    position: absolute;
    background-color: rgb(0, 0, 0, 0.5);
    color: white;
    border-radius: 5px 5px 0 0;
    padding: 0.5rem;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0;
  }
</style>
