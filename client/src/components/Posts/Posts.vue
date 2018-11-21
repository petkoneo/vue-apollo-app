<template>
  <v-container
    grid-list-xl
    fluid
  >
    <!--Post Cards-->
    <v-layout
      v-if="infiniteScrollPosts"
      row
      wrap
    >
      <v-flex
        v-for="(post, i) in infiniteScrollPosts.posts"
        :key="i"
        xs12
        sm6
      >
        <v-card
          hover
        >
          <v-img
            :src="post.imageUrl"
            height="30vh"
            lazy
            @click.native="goToPost(post._id)"
          />

          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{ post.title }}</div>
                <span class="grey--text">{{ post.likes }} likes - {{ post.messages.length }} comments</span>
              </div>
            </v-card-title>
            <v-spacer />
            <v-btn
              icon
              @click="showPostCreator =! showPostCreator"
            >
              <v-icon>{{ `keyboard_arrow_${showPostCreator? 'down' : 'up'}` }} </v-icon>
            </v-btn>
          </v-card-actions>

          <!--Post creator tile-->
          <v-slide-y-transition>
            <v-card-text
              v-show="showPostCreator"
              class="grey lighten-4"
            >
              <v-list-tile
                avatar
              >
                <v-list-tile-avatar>
                  <img
                    :src="post.createdBy.avatar"
                    :alt="post.createdBy.username"
                  >
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{ post.createdBy.username }}</v-list-tile-title>
                  <!--<v-list-tile-sub-title class="font-weight-thin">Added {{ moment(post.createdDate).format('YYYY-MM-DD') }}</v-list-tile-sub-title>-->
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn
                    icon
                    ripple
                  >
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>

              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>

        </v-card>

      </v-flex>
    </v-layout>

    <!--Adding FetchMore-->
    <v-layout
      v-if="showMoreEnabled"
      column
    >
      <v-flex
        xs12
      >
        <v-layout
          justify-center
          row
        >
          <v-btn
            color="info"
            @click="showMorePosts"
          >Show more </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
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
      // showMoreEnabled: true,
      showPostCreator: false
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
  computed: {
    showMoreEnabled () {
      return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore
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
          // this.showMoreEnabled = hasMore

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
    },
    goToPost (id) {
      this.$router.push(`/posts/${id}`)
    }
  }
}
</script>

<style>

</style>
