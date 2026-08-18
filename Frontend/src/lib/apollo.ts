import { ApolloClient, HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";

const httpLink = new HttpLink({
  // uri:"https://localhost:4002/graphql",
  uri: "https://bookmeetingroom-73rz.onrender.com/graphql",
  credentials: "include",
});
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});