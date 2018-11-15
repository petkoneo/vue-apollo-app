import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('./views/Home.vue')
const AddPost = () => import('./components/Posts/AddPost')
const Posts = () => import('./components/Posts/Posts')
const Post = () => import('./components/Posts/Post')

const Profile = () => import('./components/Auth/Profile')
const SignIn = () => import('./components/Auth/SignIn')
const SignUp = () => import('./components/Auth/SignUp')

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
