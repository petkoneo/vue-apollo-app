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
              @click="toggleLike"
            ><v-icon
              :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
              large
            >favorite</v-icon></v-btn>
            <h3 class="ml-3 font-weight-thin">{{ getPost.likes }} Likes</h3>
            <v-spacer />
            <v-icon
              color="grey"
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

    <!--Messages section-->
    <div class="mt-3">
      <!--message Input-->
      <v-layout
        v-if="getUser"
        class="mb-3"
      >
        <v-flex xs12>
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="addPostMessage"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="messageBody"
                  :rules="messageRules"
                  clearable
                  required
                  :append-outer-icon="messageBody && 'send'"
                  label="Add Message"
                  type="text"
                  prepend-icon="email"
                  @click:append-outer="addPostMessage"
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-list
            subheader
            two-line
          >
            <v-subheader>Messages ({{ getPost.messages.length }})</v-subheader>
            <template v-for="message in getPost.messages">
              <v-divider :key="message._id" />
              <v-list-tile
                :key="message.title"
                avatar
                inser
              >
                <v-list-tile-avatar>
                  <img
                    :src="message.messageUser.avatar"
                    :alt="message.messageUser.username"
                  >
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>{{ message.messageBody }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ message.messageUser.username }}</v-list-tile-sub-title>
                  <span class="grey--text text--lighten-1 hidden-xs-only"> {{ message.messageDate }}</span>
                </v-list-tile-content>

                <v-list-tile-action class="hidden-xs-only">
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>

          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST } from '../../queries'
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
      dialog: false,
      messageBody: '',
      isFormValid: true,
      messageRules: [
        message => !!message || 'Message is required',
        message => message.length < 50 || 'Message must be less than 50 characters'
      ]
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables () {
        return {
          postLiked: false,
          postId: this.postId
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getUserFavorites'])
  },
  methods: {
    likePost () {
      this.$apollo.mutate({
        mutation: LIKE_POST,
        variables: {
          postId: this.postId,
          username: this.getUser.username
        },
        update: (cache, { data: { likePost } }) => {
          const data = cache.readQuery({
            query: GET_POST,
            variables: {
              postId: this.postId
            }
          })
          data.getPost.likes += 1
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId },
            data
          })
        }
      }).then(({ data }) => {
        const updatedUser = { ...this.getUser, favorites: data.likePost.favorites }
        this.$store.commit('SET_USER', updatedUser)
      }).catch(err => console.log(err))
    },
    unlikePost () {
      this.$apollo.mutate({
        mutation: UNLIKE_POST,
        variables: {
          postId: this.postId,
          username: this.getUser.username
        },
        update: (cache, { data: { unlikePost } }) => {
          const data = cache.readQuery({
            query: GET_POST,
            variables: {
              postId: this.postId
            }
          })
          data.getPost.likes -= 1
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId },
            data
          })
        }
      }).then(({ data }) => {
        const updatedUser = { ...this.getUser, favorites: data.unlikePost.favorites }
        this.$store.commit('SET_USER', updatedUser)
      }).catch(err => console.log(err))
    },
    goToPreviousPage () {
      this.$router.go(-1)
    },
    toggleImageDialog () {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog
      }
    },
    addPostMessage () {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.getUser._id,
          postId: this.postId
        }
        this.$apollo.mutate({
          mutation: ADD_POST_MESSAGE,
          variables,
          update: (cache, { data: { addPostMessage } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            })
            data.getPost.messages.unshift(addPostMessage)
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            })
          }
        }).then(({ data }) => {
          this.$refs.form.reset()
        }).catch(err => console.log(err))
      }
    },
    checkIfOwnMessage (message) {
      return this.getUser && this.getUser._id === message.messageUser._id
    },
    toggleLike () {
      if (this.postLiked) {
        this.unlikePost()
      } else {
        this.likePost()
      }
    },
    checkIfPostLiked (postId) {
      // check if user favorites includes post with id of PostId
      if (this.getUserFavorites && this.getUserFavorites.some(fav => fav._id === postId)) {
        this.postLiked = true
        return true
      } else {
        this.postLiked = false
        return false
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
