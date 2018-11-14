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
  addPost(title:$ title, imageUrl:$imageUrl, categories:$categories, description:$description, creatorId:$creatorId) {
    createdBy{
      _id
    }
    title
    imageUrl
    description
    categories
    createdDate
  }
}`

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
