const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user
  return jwt.sign({ user: username, email }, secret, { expiresIn })
}

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (currentUser.name === 'AuthenticationError') {
        return currentUser
      }
      if (!currentUser) {
        return null
      }
      return await User.findOne({ username: currentUser.user })
        .populate({
          path: 'favorites',
          model: 'Post'
        })
    },
    getPosts: async (_, args, { Post }) => {
      return await Post
        .find({})
        .sort({ createdDate: 'desc' })
        .populate({
          path: 'createdBy',
          model: 'User'
        })
    }
  },

  Mutation: {
    addPost: async (_, { title, imageUrl, categories, description, creatorId }, { Post }) => {
      return await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save()
    },

    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username })
      if (!user) {
        throw new Error('User not existing')
      }
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error('Password not valid')
      }
      return { token: createToken(user, process.env.SECRET, '10h') }
    },

    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username })
      if (user) {
        throw new Error('user does exist')
      }

      const newUser = await new User({
        username,
        email,
        password
      }).save()
      return { token: createToken(newUser, process.env.SECRET, '10h') }
    }
  }
}
