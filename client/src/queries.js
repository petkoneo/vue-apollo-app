import gql from 'graphql-tag'

// Post Queries
export const GET_POSTS = gql`query {
          getPosts{
          _id
          title
          imageUrl
          likes
          categories
          createdDate
          description
          }
        }
        `

export const GET_POST = gql`
query($postId: ID!) {
  getPost(postId: $postId) {
  _id
  title
  imageUrl
  categories
  description
  likes
  createdDate
  messages {
    _id
    messageBody
    messageDate
    messageUser {
      _id
      username
      avatar
    }
  }
  }
}
`

export const GET_USER_POST = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId){
    _id
    title
    imageUrl
    description
    categories
    createdDate
    likes
    }
  }
`

export const SEARCH_POSTS = gql`
  query($searchTerm: String) {
    searchPosts(searchTerm: $searchTerm) {
    _id
    title
    description
    imageUrl
    likes
    }
  }
`

export const INFINITE_SCROLL_POSTS = gql`
query($pageSize: Int!, $pageNum: Int!) {
  infiniteScrollPosts(pageSize: $pageSize, pageNum: $pageNum) {
  hasMore
  posts {
    _id
    title
    imageUrl
    createdBy{
      avatar
      username
      _id
    }
    categories
    description
    likes
    createdDate
    messages {
      _id
      messageBody
    }
  }
  }
}
`

// User queries
export const GET_CURRENT_USER = gql`
  query{
    getCurrentUser{
    _id
    username
    email
    password
    avatar
    joinDate
    favorites{
    _id
    title
    imageUrl
      }
    }
  }
`

// Post Mutations
export const ADD_POST = gql`
mutation($title: String!, $imageUrl: String!, $categories: [String!], $description: String!, $creatorId: ID!){
  addPost(title: $title, imageUrl:$imageUrl, categories:$categories, description:$description, creatorId:$creatorId) {
    createdBy{
      _id
    }
    title
    imageUrl
    description
    categories
    createdDate
  }
}
`

export const UPDATE_USER_POST = gql`
mutation ($postId: ID!, $userId: ID!, $title: String!, $imageUrl: String!, $categories: [String!], $description: String!){
  updateUserPost(postId: $postId, userId: $userId, title: $title, imageUrl: $imageUrl, categories: $categories, description: $description){
  _id
  title
  imageUrl
  description
  categories
  createdDate
  likes
  createdBy {
    _id
    avatar
  }
}
}
`

export const ADD_POST_MESSAGE = gql`
mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
  addPostMessage(messageBody: $messageBody, userId: $userId, postId: $postId){
  _id
  messageBody
  messageDate
  messageUser{
    _id
    username
    avatar
    }
  }
}
`

export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!){
    likePost(postId: $postId, username: $username) {
    likes
    favorites{
      _id
      title
      imageUrl
    }
    }
  }
`

export const UNLIKE_POST = gql`
  mutation($postId: ID!, $username: String!){
    unlikePost(postId: $postId, username: $username) {
    likes
    favorites{
      _id
      title
      imageUrl
    }
    }
  }
`

// User mutations
export const SIGNIN_USER = gql`mutation($username:String!, $password: String!){
    signinUser(username:$username, password: $password){
        token
  }
}
`
export const SIGNUP_USER = gql`mutation($username:String!, $email:String!, $password: String!){
    signupUser(username: $username, email: $email, password: $password){
      token
  }
}
`
