import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

import { apolloClient } from './main'

import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER, SIGNUP_USER, ADD_POST, SEARCH_POSTS } from './queries'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: []
  },
  getters: {
    getPosts: state => state.posts,
    getLoading: state => state.loading,
    getUser: state => state.user,
    getError: state => state.error,
    getAuthError: state => state.authError,
    getUserFavorites: state => state.user && state.user.favorites,
    getSearchResults: state => state.searchResults
  },
  mutations: {
    SET_POSTS: (state, payload) => {
      state.posts = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    },
    SET_USER: (state, payload) => {
      state.user = payload
    },
    CLEAR_USER: state => {
      state.user = null
    },
    SET_ERROR: (state, payload) => {
      state.error = payload
    },
    CLEAR_ERROR: state => {
      state.error = null
    },
    SET_AUTH_ERROR: (state, payload) => {
      state.authError = payload
    },
    SET_SEARCH_RESULTS: (state, payload) => {
      if (payload != null) {
        state.searchResults = payload
      }
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient.query({
        query: GET_CURRENT_USER
      }).then(({ data }) => {
        commit('SET_LOADING', false)
        commit('SET_USER', data.getCurrentUser)
      }).catch(e => {
        console.error(e)
        commit('SET_LOADING', false)
      })
    },
    setAuthError: ({ commit }, payload) => {
      commit('SET_AUTH_ERROR', payload)
    },
    getPosts: ({ commit }) => {
      commit('SET_LOADING', true)
      // use Apolloclient to fire getPosts Query
      apolloClient
        .query({
          query: GET_POSTS
        }).then(({ data }) => {
          commit('SET_POSTS', data.getPosts)
          commit('SET_LOADING', false)
        }).catch(err => {
          commit('SET_LOADING', false)
          console.error(err)
        })
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({ data }) => {
        commit('SET_SEARCH_RESULTS', data.searchPosts)
      }).catch(err => console.log(err))
    },
    signinUser: ({ commit }, payload) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      // Clearing token to prevent errors in malfunctioning tokens
      localStorage.setItem('token', '')
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        }).then(({ data }) => {
          localStorage.setItem('token', data.signinUser.token)
          commit('SET_LOADING', false)
          // To be sure that the created method will run we do the getUser query
          router.go()
        }).catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    signoutUser: async ({ commit }) => {
      // end session on Apollo
      await apolloClient.resetStore()
      // Clear user state
      commit('CLEAR_USER')
      // redirect home - kick user out of private page
      router.push('/')
    },
    signupUser: ({ commit }, payload) => {
      commit('CLEAR_ERROR')
      commit('SET_LOADING', true)
      // Clearing token to prevent errors in malfunctioning tokens
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        }).then(({ data }) => {
          localStorage.setItem('token', data.signupUser.token)
          commit('SET_LOADING', false)
          // To be sure that the created method will run we do the getUser query
          router.go()
        }).catch(err => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
        })
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // read the query that we want to update
            const data = cache.readQuery({ query: GET_POSTS })
            // Create update data
            data.getPosts.unshift(addPost)
            // write updated data back to the query
            cache.writeQuery({
              query: GET_POSTS,
              data
            })
          },
          // optimistic response ensures data is added immediately as we specify the update function
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          }
        })
        .then(({ data }) => {
          console.log(data)
        }).catch(err => {
          console.log(err)
        })
    }
  }
})
