import { ReactNode } from "react";
import { ApolloProvider as ApolloClientProvider } from "@apollo/client";
import { apolloClient } from "~~/utils/graphql/client";

interface ApolloProviderProps {
  children: ReactNode;
}

export const ApolloProvider = ({ children }: ApolloProviderProps) => {
  return <ApolloClientProvider client={apolloClient}>{children}</ApolloClientProvider>;
};
