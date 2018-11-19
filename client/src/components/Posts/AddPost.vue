<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >
    <!--Add post Title-->
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <h1 class="primary--text">Add your Post!</h1>
      </v-flex>
    </v-layout>

    <!--Add post form-->
    <v-layout
      row
      wrapt
    >
      <v-flex
        cs12
        sm6
        offset-sm3
      >
        <v-form
          ref="form"
          v-model="isFormValid"
          lazy-validation
          @submit.prevent="addPost"
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
                Submit </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddPost',
  data () {
    return {
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
    ...mapGetters(['getLoading', 'getUser'])
  },
  methods: {
    addPost () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.getUser._id
        })
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
