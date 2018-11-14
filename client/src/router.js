import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import AddPost from './components/Posts/AddPost'
import Posts from './components/Posts/Posts'
import Post from './components/Posts/Post'

import Profile from './components/Auth/Profile'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'

import AuthGuard from './AuthGuard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/post/add',
      name: 'addpost',
      component: AddPost,
      beforeEnter: AuthGuard
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/posts/:postId',
      name: 'post',
      component: Post,
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'signun',
      component: SignUp
    }
  ]
})
