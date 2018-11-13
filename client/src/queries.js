import gql from 'graphql-tag'

// Post Queries
export const GET_POSTS = gql`query {
          getPosts{
          title
          imageUrl
          description
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
    createDate
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
