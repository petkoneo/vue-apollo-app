<template>
  <v-container
    v-if="getPost"
    class="mt-3"
    flexbox
    center
  >
    <!--Post card-->
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn
              v-if="getUser"
              large
              icon
            ><v-icon
              large
              color="grey"
            >favorite</v-icon></v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} Likes</h3>
            <v-spacer />
            <v-icon
              color="info"
              large
              @click="goToPreviousPage"
            >arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right><span>Click to enlarge image</span>
            <v-img
              id="post__image"
              slot="activator"
              :alt="getPost.title"
              :src="getPost.imageUrl"
              @click="toggleImageDialog"
          /></v-tooltip>

          <!--Enlarged Post Image-->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img
                :src="getPost.imageUrl"
                :alt="getPost.title"
                height="80vh"
              />
            </v-card>
          </v-dialog>

          <v-card-text>
            <span
              v-for="(category, i) in getPost.categories"
              :key="i"
            >
              <v-chip
                class="mb-3"
                color="accent"
                text-color="white"
              >{{ category }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { GET_POST } from '../../queries'
import { mapGetters } from 'vuex'

export default {
  name: 'Post',
  props: {
    postId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables () {
        return {
          postId: this.postId
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    goToPreviousPage() {
      this.$router.go(-1)
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog
      }
    }
  }
}
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
