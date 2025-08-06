import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// 创建 Apollo Client 实例
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.studio.thegraph.com/query/113694/monad-testnet/v0.0.1",
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});
