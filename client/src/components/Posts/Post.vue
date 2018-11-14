<template>
  <v-container v-if="getPost">
    <h1>{{ getPost.title }}</h1>
  </v-container>
</template>

<script>
import { GET_POST } from '../../queries'

export default {
  name: 'Post',
  props: {
    postId: {
      type: String,
      default: ''
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
  }
}
</script>

<style scoped>

</style>
