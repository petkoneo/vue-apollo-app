<template>
  <v-container
    v-if="infiniteScrollPosts"
    text-xs-center
  >
    <article
      v-for="(post, i) in infiniteScrollPosts.posts"
      :key="i"
    >
      <img
        :src="post.imageUrl"
        :alt="post.title"
        height="100px"
      >
      <h3>{{ post.title }}</h3>
    </article>
    <v-btn
      v-if="showMoreEnabled"
      @click="showMorePosts"
    >Fetch More</v-btn>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from '../../queries'

const pageSize = 2

export default {
  name: 'Posts',
  data () {
    return {
      pageNum: 1,
      showMoreEnabled: true
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    showMorePosts () {
      this.pageNum++
      // fetch more posts and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum incremented by one
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore
          this.showMoreEnabled = hasMore

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with the new posts
              posts: [
                ...prevResult.infiniteScrollPosts.posts,
                ...newPosts
              ],
              hasMore
            }
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
