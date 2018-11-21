const { ApolloServer, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

// importing typedefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')

// importing environment variables and mongoose schema models
require('dotenv').config({ path: 'variables.env' })
const User = require('./models/User')
const Post = require('./models/Post')

// Connect to mlab database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err))

// Verify JWT token passed from client
const getUser = async token => {
  if (token !== 'Bearer') {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (err) {
      return new AuthenticationError(
        'Your session has ended. Please sign in again.'
      )
    }
  }
}

// creating appollo/graphql server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace('Context creation failed:', '')
  }),
  formatResponse: response => {
    console.log(response)
    return response
  },
  context: async ({ req }) => {
    const token = req.headers['authorization']
    let tokenSend
    if (token) {
      tokenSend = token.split(' ')[1]
    }
    return { User, Post, currentUser: await getUser(tokenSend) }
  }
})

server.listen({ post: process.env.PORT || 4000 }).then(({ url }) => console.log(`Server Listening on ${url}`))
