import { ApolloClient, HttpLink } from '@apollo/client'
import { InMemoryCache } from '@apollo/client'

const httpLink=new HttpLink({
  uri:"http://localhost:4002/graphql",
  credentials: "include",
})
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});