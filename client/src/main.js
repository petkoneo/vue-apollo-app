import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { onError } from 'apollo-link-error'
import moment from 'moment'

import FormAlert from './components/Shared/FormAlert'

Vue.prototype.moment = moment

// Register a global
Vue.component('form-alert', FormAlert)

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'https://shareless-back-xbggfwtpul.now.sh/graphql'
})

// Including Authorization Token With request to backend
let token = localStorage.getItem('token')
if (token === null) {
  token = ''
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, name }) => {
      if (name === 'GraphQLError') {
        store.dispatch('setAuthError', message)
        store.dispatch('signoutUser')
      }
    })
  }

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: { authorization: `Bearer ${token}` }
  })
  return forward(operation)
})
const link = middlewareLink.concat(errorLink).concat(httpLink)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  created () {
    // Checks user on every request
    this.$store.dispatch('getCurrentUser')
  },
  render: h => h(App)
}).$mount('#app')
