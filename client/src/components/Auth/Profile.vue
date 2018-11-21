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
            <v-img
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
                <div class="hidden-xs-only font-weight-thin">{{ getUserPosts.length }} Post Added</div>
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

    <!--Posts created by the user-->
    <v-container v-if="!getUserPosts.length">
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <h2>You have no posts currently. Go and create some</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container
      v-else
      class="mt-3"
    >
      <v-flex xs12>
        <h2 class="font-weight-light">Your Posts <span class="font-weight-regular">({{ getUserPosts.length }})</span></h2>
      </v-flex>
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="post in getUserPosts"
          :key="post._id"
          xs12
          sm-6
        >
          <v-card class="mt3 ml-1 mr-2">
            <v-btn
              color="info"
              floating
              fab
              small
              dark
              @click="loadPost(post)"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn
              color="error"
              floating
              fab
              small
              dark
              @click="deleteUserPost(post)"
            >
              <v-icon>delete</v-icon>
            </v-btn>
            <v-img
              heigth="30vh"
              :src="post.imageUrl"
              :alt="post.title"
            />
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!--Edit Post dialog-->
    <v-dialog
      v-model="editPostDialog"
      xs12
      sm6
      persistent
      offset-sm3
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Update Post
        </v-card-title>
        <v-container>
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="updateUserPost"
          >

            <!--Title input-->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="title"
                  :rules="titleRules"
                  label="Post title"
                  type="text"
                  required
                />
              </v-flex>
            </v-layout>

            <!--Image URL-->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="imageUrl"
                  :rules="imageRules"
                  label="Image URL"
                  type="text"
                  required
                />
              </v-flex>
            </v-layout>

            <!--image preview-->
            <v-layout row><v-flex xs12><img
              :src="imageUrl"
              :alt="imageUrl"
              height="300px"
            ></v-flex></v-layout>

            <!--Categories-->
            <v-layout row><v-flex xs12><v-select
              v-model="categories"
              :rules="categoriesRules"
              :items="['Art', 'Education', 'Travel', 'Music', 'Photography', 'Technology']"
              multiple
              label="Categories"
            /></v-flex></v-layout>

            <!--Description of Post-->
            <v-layout row><v-flex xs12> <v-textarea
              v-model="description"
              :rules="descRules"
              label="Description"
            /></v-flex></v-layout>
            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!isFormValid"
                type="submit"
                class="success--text"
                flat
              >Update</v-btn>
              <v-btn
                class="error--text"
                flat
                @click="editPostDialog = false"
              >Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data () {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [
        title => !!title || 'Title is required',
        title => title.length < 20 || 'Title must have less than 20 characters'
      ],
      imageRules: [
        image => !!image || 'Image is required'
      ],
      categoriesRules: [
        categories => categories.length >= 1 || 'At least one category is required'
      ],
      descRules: [
        desc => !!desc || 'Description is required',
        desc => desc.length < 200 || 'Description has to be less then 200'
      ]
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getUserFavorites', 'getUserPosts'])
  },
  created () {
    this.userPosts()
  },
  methods: {
    userPosts () {
      this.$store.dispatch('getUserPosts', {
        userId: this.getUser._id
      })
    },
    updateUserPost () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.getUser._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        })
        this.editPostDialog = false
      }
    },
    loadPost ({ _id, title, imageUrl, categories, description }, editPostDialog = true) {
      this.editPostDialog = editPostDialog
      this.postId = _id
      this.title = title
      this.imageUrl = imageUrl
      this.categories = categories
      this.description = description
    },
    deleteUserPost (post) {
      this.loadPost(post, false)
      const deletePost = window.confirm('Are you sure you want to delete this post?')
      if (deletePost) {
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        })
      }
    }
  }
}
</script>

<style>

</style>
