const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user
  return jwt.sign({ user: username, email }, secret, { expiresIn })
}

module.exports = {
  Query: {
    getPost: async (_, { postId }, { Post }) => {
      return await Post.findOne({ _id: postId }).populate({
        path: 'messages.messageUser',
        model: 'User'
      })
    },
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
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      return await Post.find({
        createdBy: userId
      })
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts
      if (pageNum === 1) {
        posts = await Post.find({}).sort({ createdBy: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).limit(pageSize)
      } else {
        // if the page is greater than 1 how many documents we have to skip
        const skips = pageSize * (pageNum - 1)
        posts = await Post.find({}).sort({ createdBy: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).skip(skips).limit(pageSize)
      }
      const totalDocs = await Post.countDocuments()
      const hasMore = totalDocs > pageSize * pageNum
      return { posts, hasMore }
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Assign 'searchTerm' a text score for provide best match
          { score: { $meta: 'textScore' } }
          // Sort results according textScore (as well as likes in descending order)
        ).sort({
          score: { $meta: 'textScore' },
          likes: 'desc'
        })
          .limit(5)
        return searchResults
      }
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

    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      }
      const post = await Post.findOneAndUpdate(
        // We find the Post by ID
        { _id: postId },
        // prepend new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      })
      return post.messages[0]
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
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      )
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      })
      // Return only likes from 'post and favorites from 'user
      return { likes: post.likes, favorites: user.favorites }
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      )
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      })
      // Return only likes from 'post and favorites from 'user
      return { likes: post.likes, favorites: user.favorites }
    }
  }
}
